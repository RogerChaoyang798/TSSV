import { readFileSync } from 'fs';
/**
 * container class of a TSSV signal used to pass signals
 * among add* primtives and submodules to define interconnections
 */
export class Sig {
    constructor(name) {
        this.toString = () => {
            return this.name;
        };
        this.name = name;
        this.type = 'Sig';
    }
}
/**
 * container class of a TSSV expression, or a RHS assignment in the
 * generated output
 * 构造时可以将string或者((p: ExprParams) => string)类型的function传入
 */
export class Expr {
    constructor(def, params) {
        this.toString = () => {
            if (this.text) {
                return this.text;
            }
            else if (this.func) {
                return this.func(this.params || {});
            }
            return '';
        };
        if (typeof def === 'string') {
            this.text = def;
            this.func = null;
            if (params)
                throw Error('Expr params can only be used with func() type expressions');
            this.params = null;
        }
        else {
            this.text = null;
            this.func = def;
            if (params) {
                this.params = params;
            }
            else {
                this.params = {};
            }
        }
        this.type = 'Expr';
    }
}
var BinaryOp;
(function (BinaryOp) {
    BinaryOp["MULTIPLY"] = "*";
    BinaryOp["ADD"] = "+";
    BinaryOp["SUBTRACT"] = "-";
    BinaryOp["BITWISE_AND"] = "&";
    BinaryOp["BITWISE_OR"] = "|";
})(BinaryOp || (BinaryOp = {}));
/**
 * Interface is a class to define a signal bundle for a standardized
 * interface.  It wraps the modport functionality of an SV interface
 * allowing different port views of the signal bundle as well as
 * just a bundle of wires.   Interfaces simpilfy interface signal binding
 * by combining all signals into a single bundled bind.
 */
export class Interface {
    constructor(name, params = {}, role = undefined, signals = {}) {
        this.name = name;
        this.params = params;
        this.role = role;
        this.signals = signals;
    }
    interfaceName() {
        const vName = `${this.name}_${Object.values(this.params).join('_')}`;
        return vName;
    }
    writeSystemVerilog() {
        const signalArray = [];
        Object.keys(this.signals).forEach((key) => {
            const thisSignal = this.signals[key];
            if (thisSignal) {
                let rangeString = '';
                const signString = (thisSignal.isSigned) ? ' signed' : '';
                if ((thisSignal.width || 0) > 1) {
                    rangeString = `[${Number(thisSignal.width) - 1}:0]`;
                }
                signalArray.push(`${thisSignal.type || 'logic'}${signString} ${rangeString} ${key}`);
            }
        });
        const signalString = `   ${signalArray.join(';\n   ')}`;
        let modportsString = '';
        for (const modport in this.modports) {
            const thisModport = this.modports[modport];
            const modportArray = [];
            Object.keys(thisModport).forEach((name) => {
                modportArray.push(`      ${thisModport[name]} ${name}`);
            });
            modportsString += `
    modport ${modport} (
${modportArray.join(',\n')}
    );           
`;
        }
        const verilog = `
interface ${this.interfaceName()};

${signalString};

${modportsString}

endinterface
        
`;
        return verilog;
    }
}
/**
* The Module class is the base class for all TSSV modules.
*/
export class Module {
    /**
       * base constructor
       * @param params parameter value bundle
       * @param IOs IO port bundle
       * @param signals signal bundle
       * @param body SystemVerilog body text
       */
    constructor(params = {}, IOs = {}, signals = {}, body = '') {
        this.bindingRules = {
            input: ['input', 'wire', 'reg', 'const logic', 'logic', 'enum'],
            output: ['output', 'wire', 'logic', 'enum'],
            inout: ['inout', 'wire']
        };
        this.registerBlocks = {};
        this.regBlksReorder = {};
        this.params = params;
        if (typeof params.name === 'string') {
            this.name = params.name;
        }
        else {
            const mapFunc = (p) => {
                if (typeof p === 'object') {
                    return this.simpleHash(JSON.stringify(p, function (key, value) {
                        if (typeof value === 'bigint') {
                            return value.toString();
                        }
                        return value;
                    }));
                }
                return p;
            };
            this.name = this.constructor.name + '_' + Object.values(params).filter((p) => (p !== undefined)).map(mapFunc).join('_');
        }
        this.params.name = this.name;
        this.IOs = IOs;
        this.signals = signals;
        this.body = body;
        this.submodules = {};
        this.interfaces = {};
        this.verilogParams = {};
    }
    setVerilogParameter(param) {
        if (!this.params[param]) {
            throw Error(`${param} does not exist!`);
        }
        else {
            const thisParam = this.params[param];
            if ((typeof thisParam === 'string') || (typeof thisParam === 'number') || (typeof thisParam === 'bigint')) {
                this.verilogParams[param] = true;
            }
            else {
                throw Error(`unsupported type of parameter ${param} in setVerilogParameter()`);
            }
        }
    }
    /**
       * adds an interface signal bundle
       * @param instanceName the name for this instance of the signal bundle
       * @param _interface the type of interface to add
       * @returns the resulting interface for connecting to modules and add* primitives
       */
    addInterface(instanceName, _interface) {
        if (this.interfaces[instanceName])
            throw Error(`${instanceName} interface already exists`);
        this.interfaces[instanceName] = _interface;
        return _interface;
    }
    /**
       * instantiate another module a a submodule
       * @param instanceName sets the instance mane
       * @param submodule the module to instantiate
       * @param bindings define the connections of the submodule
       * @param autoBind find signals in parent with matching name for signals that are not explicitly bound
       * @returns returns the resulting submodule instance
       */
    addSubmodule(instanceName, submodule, bindings, autoBind = true, createMissing = false, autoWidthExtension = false) {
        if (this.submodules.instanceName !== undefined)
            throw Error(`submodule with instance name ${instanceName} already exists`);
        const thisModule = {
            module: submodule,
            bindings
        };
        this.submodules[instanceName] = thisModule;
        if (autoBind) {
            for (const thisPort in submodule.IOs) {
                if (!thisModule.bindings[thisPort]) {
                    if (this.IOs[thisPort]) {
                        thisModule.bindings[thisPort] = thisPort;
                    }
                    else if (this.signals[thisPort]) {
                        thisModule.bindings[thisPort] = thisPort;
                    }
                    else if (createMissing) {
                        const thisIO = submodule.IOs[thisPort];
                        this.addSignal(thisPort, {
                            width: thisIO.width,
                            isSigned: thisIO.isSigned,
                            isClock: thisIO.isClock,
                            isReset: thisIO.isReset,
                            isArray: thisIO.isArray
                        });
                        thisModule.bindings[thisPort] = thisPort;
                    }
                    else if (submodule.IOs[thisPort].direction === 'input') {
                        throw Error(`unbound input on ${submodule.name}: ${thisPort}`);
                    }
                }
            }
            for (const _interface in submodule.interfaces) {
                const thisInterface = submodule.interfaces[_interface];
                if (thisInterface.role && thisInterface.modports) {
                    if (!thisModule.bindings[_interface]) {
                        if (this.interfaces[_interface]) {
                            thisModule.bindings[_interface] = _interface;
                        }
                        else if (createMissing) {
                            this.addInterface(_interface, new Interface(thisInterface.name, thisInterface.params, undefined, thisInterface.signals));
                            thisModule.bindings[_interface] = _interface;
                        }
                        else {
                            throw Error(`unbound interface on ${submodule.name}: ${_interface}`);
                        }
                    }
                }
            }
        }
        for (const port in thisModule.bindings) {
            const thisPort = submodule.IOs[port];
            const thisInterface = submodule.interfaces[port];
            if (thisPort) {
                let thisBinding = bindings[port];
                if (typeof thisBinding === 'bigint') {
                    thisBinding = this.addConstSignal(undefined, thisBinding, (thisBinding < 0n), thisPort.width);
                    bindings[port] = thisBinding;
                }
                const thisSig = this.findSignal(thisBinding, true, this.addSubmodule, true);
                if (thisSig.isSigned && (thisPort.isSigned !== true)) {
                    throw Error(`Error: signed signals can only be connected to signed ports, port: ${port.toString()}, signal: ${thisBinding.toString()}}`);
                }
                if (thisSig.isSigned) {
                    if ((thisSig.width || 1) > (thisPort.width || 1)) {
                        throw Error(`Error: binding signal is too wide for port, port: ${port.toString()}, signal: ${thisBinding.toString()}}, signal width: ${thisSig.width}, port width: ${thisPort.width}`);
                    }
                }
                else {
                    if (thisPort.isSigned) {
                        if (((thisSig.width || 1) + 1) > (thisPort.width || 1)) {
                            throw Error(`Error: binding signal is too wide for port, port: ${port.toString()}, signal: ${thisBinding.toString()}}, signed and unsigned mismatch extra bit is needed to sign unsigned number`);
                        }
                    }
                    else {
                        if ((thisSig.width || 1) > (thisPort.width || 1)) {
                            throw Error(`Error: binding signal is too wide for port, port: ${port.toString()}, signal: ${thisBinding.toString()}}, signal width: ${thisSig.width}, port width: ${thisPort.width}`);
                        }
                    }
                }
                if (autoWidthExtension && (thisPort.direction === 'input')) {
                    // sign or zero extend input automatically
                    if ((thisSig.width || 1) < (thisPort.width || 1)) {
                        const extBits = (thisPort.width || 1) - (thisSig.width || 1);
                        const s_or_u = (thisPort.isSigned) ? 's' : 'u';
                        const extSigName = `ext_w${extBits}${s_or_u}_${thisBinding.toString()}`;
                        if (this.findSignal(extSigName) === undefined) {
                            const extSig = this.addSignal(extSigName, thisPort);
                            if (thisSig.isSigned) {
                                const signBit = (thisSig.width || 1) - 1;
                                this.addAssign({
                                    in: new Expr(`{{${extBits}{${thisBinding.toString()}[${signBit}]}},${thisBinding.toString()}}`),
                                    out: extSig
                                });
                            }
                            else {
                                this.addAssign({ in: new Expr(`{${extBits}'d0,${thisBinding.toString()}}`), out: extSig });
                            }
                            bindings[port] = extSig;
                        }
                        else {
                            bindings[port] = extSigName;
                        }
                    }
                }
                else {
                    if ((thisSig.width || 1) !== (thisPort.width || 1)) {
                        throw Error(`Error: binding signal width mismatch, port: ${port.toString()}, signal: ${thisBinding.toString()}}, port width: ${thisPort.width}, signal width: ${thisSig.width}`);
                    }
                }
                if (!(this.bindingRules[thisPort.direction].includes(thisSig.type || 'logic')))
                    throw Error(`illegal binding ${port}(${bindings[port].toString()})`);
            }
            else if (thisInterface && (typeof port === 'string')) {
                const thisInt = this.interfaces[bindings[port].toString()];
                if (thisInt.role) {
                    if (thisInt.role !== thisInterface.role)
                        throw Error(`${port} interface role mismatch on ${submodule.name}`);
                }
            }
            else {
                throw Error(`${port} not found on module ${submodule.name}`);
            }
        }
        return thisModule.module;
    }
    addSystemVerilogSubmodule(instanceName, SVFilePath, params, bindings, autoBind = true) {
        const SVString = readFileSync(SVFilePath, { encoding: 'utf8', flag: 'r' }).toString();
        const vIOs = {};
        for (const port in bindings) {
            const thisSignal = this.findSignal(bindings[port]);
            const re = new RegExp(`input\\s*${port}[;\\s,]`);
            if (re.test(SVString)) {
                vIOs[port] = { direction: 'input', ...thisSignal };
            }
            else {
                vIOs[port] = { direction: 'output', ...thisSignal };
            }
        }
        let vModuleName = 'IMPORT';
        const re2 = /module\s([a-zA-Z0-9_]*)[;\w\s()]/;
        const match = SVString.match(re2);
        if (match && match.length >= 2) {
            vModuleName = match[1];
        }
        const vModule = new Module({ name: vModuleName, ...params }, vIOs, {}, SVString);
        for (const p in vModule.params) {
            if (p !== 'name') {
                vModule.setVerilogParameter(p);
            }
        }
        vModule.writeSystemVerilog = () => { return SVString; };
        return this.addSubmodule(instanceName, vModule, bindings, autoBind);
    }
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
        }
        // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
        return (hash >>> 0).toString(36).padStart(7, '0');
    }
    bigintToSigName(value, isSigned, width) {
        if (isSigned === undefined) {
            isSigned = (value < 0n);
        }
        if (width === undefined) {
            width = this.bitWidth(value, isSigned);
        }
        if (width < this.bitWidth(value, isSigned)) {
            throw Error(`${width} is not enougn bits to hold value ${value}`);
        }
        const absVal = (value < 0n) ? `m${-value.toString()}` : value.toString();
        return `const_w${width}${isSigned ? 's' : 'u'}${absVal}`;
    }
    // we do not call the caller, we just grab the name for an error message
    // so the explicit anys are fine
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    findSignal(sig, throwOnFalse = false, caller = null, throwOnArray) {
        const sigString = (typeof sig === 'bigint') ? this.bigintToSigName(sig) : sig.toString();
        const thisSig = this.IOs[sigString] || this.signals[sigString];
        if (!thisSig) {
            const sigParts = sigString.split('.');
            if (sigParts.length === 2) {
                const [interfaceName, signalName] = sigParts;
                const interfaceObj = this.interfaces[interfaceName];
                if (interfaceObj) {
                    const interfaceSignal = interfaceObj.signals[signalName];
                    if (interfaceSignal) {
                        return interfaceSignal;
                    }
                }
            }
            if (throwOnFalse) {
                let errString = '';
                if (typeof caller === 'function') {
                    errString = `${sig.toString()} signal not found in ${caller.name}()`;
                }
                else if (caller !== null) {
                    errString = `${caller.toString()}: ${sig.toString()} signal not found`;
                }
                throw Error(errString);
            }
        }
        if (throwOnArray && thisSig.isArray) {
            let errString = '';
            if (typeof caller === 'function') {
                errString = `${sig.toString()} array signal used as normal signal in ${caller.name}()`;
            }
            else if (caller !== null) {
                errString = `${caller.toString()}: ${sig.toString()} array signal used as normal signal`;
            }
            throw Error(errString);
        }
        return thisSig;
    }
    /**
       * add a signal to the SystemVerilog module
       * @param name name of the signal
       * @param signal parameters of the signal
       * @returns signal that can be passed to other add* functions to make connections
       */
    addSignal(name, signal) {
        if (this.findSignal(name))
            throw Error(`${name} signal already exists`);
        this.signals[name] = signal;
        return new Sig(name);
    }
    /**
       * add a DFF register(can be multi-bit) to the d input
       * @param io the input/output of the register
       * @returns return the q output signal
       */
    addRegister(io) {
        let qName = io.q;
        // Regular expression to match Verilog numeric literals
        const verilogNumberPattern = /^\d+'[bBoOdDhH][0-9a-fA-FxXzZ]+$/;
        if ((typeof io.d === 'string' && !verilogNumberPattern.test(io.d)) || (io.d instanceof Sig && io.d.type === 'Sig')) {
            const dSig = this.findSignal(io.d, true, this.addRegister, true);
            if (io.q === undefined) {
                qName = `${io.d.toString()}_q`;
                if (this.signals[qName] || this.IOs[qName])
                    throw Error(`generate ${qName} in addRegister as io.q is undefined, but ${qName} signal already exists`);
                this.signals[qName] = { ...dSig, type: 'logic' };
            }
        }
        if (io.q) {
            const qSig = this.findSignal(io.q, true, this.addRegister, true);
            switch (qSig.type) {
                case undefined:
                case 'wire':
                    qSig.type = 'logic';
                    break;
                case 'reg':
                case 'logic':
                    break;
                default:
                    throw Error(`${io.q.toString()} is unsupported signal type ${qSig.type}`);
            }
            qName = io.q;
        }
        if (qName === undefined) {
            throw Error(`addRegister(${JSON.stringify(io)}) auto q naming only allowed when d is a simple signal, not an expression`);
        }
        const d = io.d.toString();
        const clkSig = this.findSignal(io.clk, true, this.addRegister, true);
        if (!clkSig.isClock)
            throw Error(`${io.clk.toString()} is not a clock signal`);
        let resetSensitivity = '';
        let resetCondition = '#NONE#';
        if (io.reset) {
            const rstSig = this.findSignal(io.reset, true, this.addRegister, true);
            if (!rstSig.isReset)
                throw Error(`${io.reset.toString()} is not a reset signal`);
            switch (rstSig.isReset) {
                case 'highasync':
                    resetSensitivity = ` or posedge ${io.reset.toString()}`;
                    resetCondition = `${io.reset.toString()}`;
                    break;
                case 'lowasync':
                    resetSensitivity = ` or negedge ${io.reset.toString()}`;
                    resetCondition = `!${io.reset.toString()}`;
                    break;
                case 'lowsync':
                    resetCondition = `!${io.reset.toString()}`;
                    break;
                case 'highsync':
                    resetCondition = `${io.reset.toString()}`;
                    break;
                default:
            }
        }
        const sensitivityList = `@( ${clkSig.isClock} ${io.clk.toString()} ${resetSensitivity} )`;
        let enableExpr = '#NONE#';
        if (io.en !== undefined) {
            enableExpr = io.en.toString();
        }
        if (!this.registerBlocks[sensitivityList]) {
            this.registerBlocks[sensitivityList] = {};
            this.regBlksReorder[sensitivityList] = {};
        }
        if (!this.registerBlocks[sensitivityList][resetCondition]) {
            this.registerBlocks[sensitivityList][resetCondition] = {};
            this.regBlksReorder[sensitivityList][resetCondition] = {};
        }
        if (!this.registerBlocks[sensitivityList][resetCondition][enableExpr]) {
            this.registerBlocks[sensitivityList][resetCondition][enableExpr] = {};
        }
        if (!this.regBlksReorder[sensitivityList][resetCondition][qName.toString()]) {
            this.regBlksReorder[sensitivityList][resetCondition][qName.toString()] = {};
        }
        this.registerBlocks[sensitivityList][resetCondition][enableExpr][qName.toString()] = { d, resetVal: io.resetVal };
        this.regBlksReorder[sensitivityList][resetCondition][qName.toString()][enableExpr] = { d, resetVal: io.resetVal };
        if (typeof qName === 'string') {
            return new Sig(qName);
        }
        return qName;
    }
    /**
       * get the number of bits need to represent an integer value
       * @param a the value to determine the bit width of
       * @param isSigned whether the value should be treated as a signed number
       * @returns the minimum bit width needed to represent the value
       */
    bitWidth(a, isSigned = false) {
        return (Math.ceil(Math.log2(Math.abs(Number(a)) + Number(a >= 0)) + Number(isSigned || (a < 0))));
    }
    /**
       * add a rounding operation to scale down and reduce the bit width of a signal
       * @param io the input/output signals of the round operation the rShift signal determines
       * the number of LSBs to round away.  The rShift signal can be either a liternal constant or a variable
       * shift.  When using a variable shift,  care should be taken to minimize the number of bits to
       * minimize the impact on the timing path of the resulting logic.
       * @param roundMode determines the type of rounding to apply
       * @returns the signal of the rounded result
       */
    addRound(io, roundMode = 'rp') {
        const inSig = this.findSignal(io.in, true, this.addRound, true);
        const outSig = this.findSignal(io.out, true, this.addRound, true);
        const rShiftString = io.rShift.toString();
        if (typeof io.rShift !== 'number') {
            const rShiftSig = this.findSignal(io.rShift, true, this.addRound, true);
            if (rShiftSig.isSigned)
                throw Error(`right shift signal ${io.rShift.toString()} must be unsigned`);
        }
        if (inSig.isSigned !== outSig.isSigned)
            throw Error(`sign mode must match ${io.in.toString()}, ${io.out.toString()}`);
        if (roundMode === 'rp') { // roundUp
            this.body += `   assign ${io.out.toString()} = (${io.in.toString()} + (${inSig.width || 1}'sd1<<<(${rShiftString}-1)))>>>${rShiftString};\n`;
        }
        else if (roundMode === 'rm') { // roundDown
            this.body += `   assign ${io.out.toString()} = ${io.in.toString()} >>> ${rShiftString};\n`;
        }
        else if (roundMode === 'rz') { // roundToZero
            this.body += `   assign ${io.out.toString()} = (${io.in.toString()} >= 0) ? (${io.in.toString()} >>> ${rShiftString}) : (${io.in.toString()} + (${inSig.width || 1}'sd1<<<(${rShiftString}-1)))>>>${rShiftString};\n`;
        }
        else if (roundMode === 'rn') { // roundToNearestEven
            this.body += `   assign ${io.out.toString()} = (${io.in.toString()} >>> ${rShiftString}) + (((${io.in.toString()} >>> (${rShiftString} - 1)) & 1) & ((${io.in.toString()} >>> ${rShiftString}) & 1));\n`;
        }
        else if (roundMode === 'rna') { // roundAwayFromZero
            this.body += `   assign ${io.out.toString()} = (${io.in.toString()} >>> ${rShiftString}) + ((${io.in.toString()}[0] ^ ${io.in.toString()}[${rShiftString}]) ? 1 : 0);\n`;
        }
        else {
            throw Error('roundMode not found');
        }
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    /**
       * add a Saturate operation to limit the bit width of a signal without overflow
       * @param io the input and output signals of the saturation operation
       * @param satMode determines the behavior of the saturation
       * @returns signal of the result of the saturation
       */
    addSaturate(io, satMode = 'simple') {
        // if (satMode === 'balanced') throw Error(`FIXME: ${satMode} not implemented yet`) // still have to add balanced
        const inSig = this.findSignal(io.in, true, this.addSaturate, true);
        const outSig = this.findSignal(io.out, true, this.addSaturate, true);
        if (inSig.isSigned !== outSig.isSigned)
            throw Error(`sign mode must match ${io.in.toString()}, ${io.out.toString()}`);
        if (inSig.isSigned) {
            const sat = 1 << ((outSig.width || 1) - 1);
            const maxSatStringIn = `${inSig.width}'sd${sat - 1}`;
            const minSatStringIn = `$signed(-${inSig.width}'d${sat})`;
            const maxSatString = `${outSig.width}'sd${sat - 1}`;
            const minSatString = `-${outSig.width}'d${sat}`;
            if (satMode === 'simple') {
                this.body +=
                    `   assign ${io.out.toString()} = (${io.in.toString()} > ${maxSatStringIn}) ? ${maxSatString} :
                       ((${io.in.toString()} < ${minSatStringIn}) ? ${minSatString} : ${io.in.toString()});
`;
            }
            else if (satMode === 'none') {
                this.body +=
                    `   assign ${io.out.toString()} = (${io.in.toString()} > ${maxSatStringIn}) ? 
                       {1'b0,(${io.in.toString()}[${outSig.width}-2:0])} : 
                       ((${io.in.toString()} < ${minSatStringIn}) ? 
                       {1'b1,(${io.in.toString()}[${outSig.width}-2:0])} : 
                       ${io.in.toString()}[${outSig.width}-1:0]);
`;
            }
            else if (satMode === 'balanced') {
                this.body +=
                    `   assign ${io.out.toString()} = (${io.in.toString()} > ${maxSatStringIn}) ? ${maxSatString} :
                      ((${io.in.toString()} < ${minSatStringIn}) ? ${minSatString}+1 : ${io.in.toString()});
`;
            }
        }
        else {
            const sat = (1 << ((outSig.width || 1))) - 1;
            const maxSatStringIn = `${outSig.width}'d${sat}`;
            const maxSatString = `${outSig.width}'d${sat}`;
            if (satMode === 'simple' || satMode === 'balanced') {
                this.body +=
                    `   assign ${io.out.toString()} = (${io.in.toString()} > ${maxSatStringIn}) ? ${maxSatString} : (${io.in.toString()});
`;
            }
            else if (satMode === 'none') {
                this.body +=
                    `   assign ${io.out.toString()} = ${io.in.toString()}[${outSig.width}:0];
`;
            }
        }
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    addSequentialAlways(io, body) {
        for (const output of io.outputs) {
            const thisSig = this.findSignal(output, true, this.addSequentialAlways);
            switch (thisSig.type) {
                case undefined:
                case 'wire':
                    thisSig.type = 'logic';
                    break;
                case 'reg':
                case 'logic':
                    break;
                default:
                    throw Error(`${output.toString()} is unsupported signal type ${thisSig.type}`);
            }
        }
        const clkSig = this.findSignal(io.clk, true, this.addRegister, true);
        if (!clkSig.isClock)
            throw Error(`${io.clk.toString()} is not a clock signal`);
        let resetSensitivity = '';
        if (io.reset) {
            const rstSig = this.findSignal(io.reset, true, this.addRegister, true);
            if (!rstSig.isReset)
                throw Error(`${io.reset.toString()} is not a reset signal`);
            switch (rstSig.isReset) {
                case 'highasync':
                    resetSensitivity = `or posedge ${io.reset.toString()}`;
                    break;
                case 'lowasync':
                    resetSensitivity = `or negedge ${io.reset.toString()}`;
                    break;
                default:
            }
        }
        const sensitivityList = `@( ${clkSig.isClock} ${io.clk.toString()} ${resetSensitivity} )`;
        if (body.includes('always_ff')) {
            const clkSenseMatch = body.replace(/\s+/g, ' ').includes(`${clkSig.isClock} ${io.clk.toString()}`);
            const resetSenseMatch = (resetSensitivity === '') || body.replace(/\s+/g, ' ').includes(resetSensitivity);
            if (clkSenseMatch && resetSenseMatch) {
                this.body += body;
            }
            else {
                throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`);
            }
        }
        else {
            this.body += `always_ff ${sensitivityList}\n`;
            this.body += body;
        }
    }
    addCombAlways(io, body) {
        for (const output of io.outputs) {
            const thisSig = this.findSignal(output, true, this.addCombAlways);
            switch (thisSig.type) {
                case undefined:
                case 'wire':
                    thisSig.type = 'logic';
                    break;
                case 'reg':
                case 'logic':
                    break;
                default:
                    throw Error(`${output.toString()} is unsupported signal type ${thisSig.type}`);
            }
        }
        let sensitivityList = null;
        if (io.inputs) {
            for (const input of io.inputs) {
                this.findSignal(input, true, this.addCombAlways);
            }
            sensitivityList = `@( ${io.inputs.join(' or ')} )`;
        }
        if (body.includes('always')) {
            const SenseMatch = body.replace(/\s+/g, ' ').includes(`${sensitivityList}`);
            if (SenseMatch) {
                this.body += body;
            }
            else {
                throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`);
            }
        }
        else if (sensitivityList) {
            this.body += `always ${sensitivityList}\n`;
            this.body += body;
        }
        else {
            this.body += 'always_comb\n';
            this.body += body;
        }
    }
    addLatchAlways(io, body) {
        for (const output of io.outputs) {
            const thisSig = this.findSignal(output, true, this.addLatchAlways);
            switch (thisSig.type) {
                case undefined:
                case 'wire':
                    thisSig.type = 'logic';
                    break;
                case 'reg':
                case 'logic':
                    break;
                default:
                    throw Error(`${output.toString()} is unsupported signal type ${thisSig.type}`);
            }
        }
        let sensitivityList = null;
        if (io.inputs) {
            for (const input of io.inputs) {
                this.findSignal(input, true, this.addLatchAlways);
            }
            sensitivityList = `@( ${io.inputs.join(' or ')} )`;
        }
        if (body.includes('always')) {
            const SenseMatch = body.replace(/\s+/g, ' ').includes(`${sensitivityList}`);
            if (SenseMatch) {
                this.body += body;
            }
            else {
                throw Error(`Sensitivity mismatch: ${sensitivityList} : ${body}`);
            }
        }
        else if (sensitivityList) {
            this.body += `always ${sensitivityList}\n`;
            this.body += body;
        }
        else {
            this.body += 'always_latch\n';
            this.body += body;
        }
    }
    addOperation(op, io) {
        const nameMap = {
            '*': {
                name: 'prod',
                autoWidth: (a, b) => { return a + b; }
            },
            '-': {
                name: 'diff',
                autoWidth: (a, b) => { return Math.max(a, b) + 1; }
            },
            '+': {
                name: 'sum',
                autoWidth: (a, b) => { return Math.max(a, b) + 1; }
            },
            '&': {
                name: 'mask',
                autoWidth: (a, b) => { return Math.max(a, b); }
            },
            '|': {
                name: 'bitset',
                autoWidth: (a, b) => { return Math.max(a, b); }
            }
        };
        let aOperand;
        let bOperand;
        let aAuto = io.a;
        let bAuto = io.b;
        let aWidth = 0;
        let bWidth = 0;
        let aSigned = false;
        let bSigned = false;
        let aLiteral = false;
        if (typeof io.a !== 'bigint') {
            const aSig = this.findSignal(io.a, true, this.addOperation, true);
            aOperand = io.a;
            aWidth = Number(aSig.width);
            aSigned = aSig.isSigned || false;
            // if (aSigned) {
            //   aOperand = `$signed(${aOperand.toString()})`
            // }
        }
        else {
            aWidth = this.bitWidth(io.a);
            aSigned = (io.a < 0);
            aOperand = (aSigned) ? `-${aWidth}'d${Math.abs(Number(io.a))}` : `${aWidth + 1}'d${io.a}`;
            aAuto = aOperand.replace('-', 'm').replace("'", '');
            aLiteral = true;
        }
        if (typeof io.b !== 'bigint') {
            const bSig = this.findSignal(io.b, true, this.addOperation, true);
            bOperand = io.b;
            bWidth = Number(bSig.width);
            bSigned = bSig.isSigned || false;
            if (typeof io.a !== 'bigint') {
                if (bSigned !== aSigned) {
                    if (aSigned) {
                        bOperand = `{1'b0,${bOperand.toString()}}`;
                    }
                    else {
                        aOperand = `{1'b0,${aOperand.toString()}}`;
                    }
                    aOperand = `$signed(${aOperand.toString()})`;
                    bOperand = `$signed(${bOperand.toString()})`;
                }
            }
        }
        else {
            bWidth = this.bitWidth(io.b);
            bSigned = (io.b < 0);
            bOperand = (bSigned) ? `-${bWidth}'d${Math.abs(Number(io.b))}` : `${bWidth + 1}'d${io.b}`;
            bAuto = bOperand.replace('-', 'm').replace("'", '');
            if (aSigned) {
                bOperand = `$signed(${bOperand})`;
            }
        }
        if (aLiteral) {
            aOperand = `$signed(${aOperand.toString()})`;
        }
        let result = '#NONE#';
        if (io.result !== undefined) {
            const resultSig = this.findSignal(io.result, true, this.addOperation, true);
            if (resultSig.isSigned === undefined) {
                resultSig.isSigned = (aSigned || bSigned);
            }
            if ((aSigned || bSigned) && (!(resultSig.isSigned)))
                throw Error(`${io.result.toString()} must be signed`);
            console.log();
            if ((resultSig.width || 0) < nameMap[op].autoWidth(aWidth, bWidth))
                console.warn(`${io.result.toString()} truncated output`);
            result = io.result;
        }
        else {
            result = `${nameMap[op].name}_${aAuto.toString()}x${bAuto.toString()}`;
            this.signals[result] = {
                type: 'logic',
                isSigned: (aSigned || bSigned),
                width: nameMap[op].autoWidth(aWidth, bWidth)
            };
        }
        this.body += `   assign ${result.toString()} = ${aOperand.toString()} ${op} ${bOperand.toString()};\n`;
        if (typeof result === 'string') {
            return new Sig(result);
        }
        return result;
    }
    addMultiplier(io) {
        return this.addOperation(BinaryOp.MULTIPLY, io);
    }
    /**
       * adds an arithmetic adder to the generated SystemVerilog module
       * @param io the input/output interface of the adder
       * @returns the sum result
       */
    addAdder(io) {
        return this.addOperation(BinaryOp.ADD, io);
    }
    /**
       * adds an arithemetic subtractor to the generated SystemVerilog module
       * @param io the input/output interface of the subtractor
       * @returns the difference result
       */
    addSubtractor(io) {
        return this.addOperation(BinaryOp.SUBTRACT, io);
    }
    /**
       * add a constant literal signal to the generated SystemVerilog module
       * @param name signal name
       * @param value signal literal value
       * @param isSigned whether the signal is signed or not
       * @param width bit width of the resulting signal
       * @returns
       */
    addConstSignal(name, value, isSigned = false, width = undefined) {
        const minWidth = this.bitWidth(value, isSigned);
        const resolvedWidth = (width === undefined) ? minWidth : width;
        if (value < 0)
            isSigned = true;
        if (resolvedWidth < minWidth)
            throw Error(`width:${resolvedWidth} is insufficient for value: ${value}`);
        if (name === undefined) {
            name = this.bigintToSigName(value, isSigned, resolvedWidth);
        }
        if (this.signals[name] === undefined) {
            this.signals[name] = { type: 'const logic', value, isSigned, width: resolvedWidth };
        }
        return new Sig(name);
    }
    /**
       * add an array of constant literal signals to the generated SystemVerilog module
       * @param name signal name
       * @param values the literal values of the array
       * @param isSigned whether the signals are signed or not
       * @param width bit width of the resulting signals
       * @returns The array of signals
       */
    addConstSignals(name, values, isSigned = false, width = undefined) {
        const signalNames = [...Array(values.length).keys()].map((p) => { return `${name}_${p}`; });
        const retVal = [];
        signalNames.forEach((p, i) => {
            retVal.push(this.addConstSignal(p, values[i], isSigned || (values[i] < 0), width));
        });
        return retVal;
    }
    /**
       * add a SystemVerilog continuous assign statement
       * @param io expression that is the right hand side of the assigment
       * @returns signal that is the left hand side of the assignment
       */
    addAssign(io) {
        const outSig = this.findSignal(io.out, true, this.addAssign, true);
        if (outSig.type && (!(outSig.type === 'wire' || outSig.type === 'logic'))) {
            throw Error(`${io.out.toString()} signal must be either wire or logic in assign statement`);
        }
        this.body += `assign ${io.out.toString()} = ${io.in.toString()};\n`;
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    /**
       * add a multiplexer to the TSSV module
       * @param io The input/output signals connected to the multiplexer
       * @returns signal of the multiplexer output
       */
    addMux(io) {
        const selWidth = Math.ceil(Math.log2(io.in.length)); // remove -1
        let selString = io.sel.toString();
        if ((typeof io.sel === 'string') || (io.sel.type === 'Sig')) {
            const selSig = this.findSignal(io.sel, true, this.addMux, true);
            if ((selSig.width || 1) < selWidth)
                throw Error(`${io.sel.toString()} signal does not have enough bits as Mux select, select signal width: ${selSig.width} is less than select width ${selWidth}`);
            if ((selSig.width || 1) > selWidth) {
                selString = `${io.sel.toString()}[${selWidth - 1}:0]`;
            }
        }
        const outSig = this.findSignal(io.out, true, this.addMux, true);
        switch (outSig.type) {
            case undefined:
            case 'wire':
                outSig.type = 'logic';
                break;
            case 'reg':
            case 'logic':
                break;
            default:
                throw Error(`${io.out.toString()} is unsupported signal type ${outSig.type}`);
        }
        let defaultString = `{${outSig.width}{1'bx}}`;
        if (io.default) {
            defaultString = io.default.toString();
        }
        let caseAssignments = '';
        let selIndex = 0;
        for (const input of io.in) {
            const rhExpr = `${input.toString()}`;
            caseAssignments += `      ${selWidth}'d${selIndex}: ${io.out.toString()} = ${rhExpr};\n`;
            selIndex++;
        }
        this.body +=
            `  always_comb
    unique case(${selString})
${caseAssignments}
      default: ${io.out.toString()} = ${defaultString};
    endcase
`;
        if (typeof io.out === 'string') {
            return new Sig(io.out);
        }
        return io.out;
    }
    /**
     * Adds a range expression to the given IO object.
     * If `io.b` is not a `Sig` object and is non-empty, it appends the range expression to `io.b`.
     * If `io.b` is empty, it creates a new range expression and assigns it to `io.b`.
     * @param io The operation IO object containing `a` (range) and `b` (the current expression or signal)
     * @returns The updated string representing the modified `b` expression
     * @throws Error If `io.b` is of unsupported type `Sig`
     */
    addInRange(io) {
        if (io.b instanceof Sig) {
            throw Error('unsupported type of io.b in addInRange()');
        }
        else {
            if (io.b.toString() !== '') {
                io.b = io.b.toString().slice(0, -1);
                const decExpr = `,\n${io.a.toString()}}`;
                io.b += decExpr;
            }
            else {
                io.b += `|{${io.a.toString()}}`;
            }
            return io.b.toString();
        }
    }
    /**
     * Adds a read multiplexer expression to the given output expression.
     * The function constructs a read signal by performing a bitwise AND between the input signal `a` and `b`,
     * scaled to the given `wordSize`, and appends it to the provided `outRhs`.
     * If `outRhs` is non-empty, the new expression is concatenated with a bitwise OR operator.
     * If `outRhs` is empty, the expression is simply added as the first part of `outRhs`.
     * @param io The operation IO object containing input signal `a` and additional signal `b`
     * @param outRhs The existing output expression to which the new read mux signal will be added
     * @param wordSize The size of the word (in bits) used to scale the `a` signal
     * @returns The updated output expression with the added read mux signal
     */
    addReadMux(io, outRhs, wordSize) {
        const readSignal = `( {${wordSize}{${io.a.toString()}}} & ${io.b.toString()} )`;
        if (outRhs !== '') {
            const modifiedReadExpr = ` |\n${readSignal}`;
            outRhs += modifiedReadExpr;
        }
        else {
            outRhs += `\n${readSignal}`;
        }
        return outRhs;
    }
    /**
       * print some debug information to the console
       */
    debug() {
        console.log(this.name);
        console.log(this.params);
        console.log(this.IOs);
        console.log(this.signals);
        console.log(this.body);
        console.log(this.registerBlocks);
    }
    assembleParameters() {
        if (!this.params)
            return '';
        const paramsArray = Object.entries(this.params)
            .filter((entry) => {
            const [_, value] = entry;
            return typeof value === 'number';
        })
        .map(([key, value]) => `parameter ${key} = ${value.toString()}`);
        return paramsArray.length > 0 ? `    #(${paramsArray.join(',\n    ')})` : '';
    }
    assembleIODefinition(isSystemVerilog = true) {
        const IOArray = [];
        const signalArray = [];
        let interfacesString = '';
        Object.entries(this.IOs).forEach(([key, io]) => {
            let rangeString = '';
            const signString = io.isSigned ? ' signed' : '';
            if (io.isArray)
                throw Error(`${key}: Array IOs not supported`);
            if ((io.width || 0) > 1) {
                rangeString = `[${Number(io.width) - 1}:0]`;
            }
            if (isSystemVerilog) {
                IOArray.push(`${io.direction} ${io.type || 'logic'}${signString} ${rangeString} ${key}`);
            }
            else {
                if (io.type === 'reg') {
                    IOArray.push(`${this.IOs[key].direction} ${io.type} ${signString} ${rangeString} ${key}`);
                } else {
                    IOArray.push(`${this.IOs[key].direction} ${signString} ${rangeString} ${key}`);
                }
            }
        });
        Object.entries(this.interfaces).forEach(([key, thisInterface]) => {
            if (thisInterface.role) {
                if (thisInterface.modports) {
                    const thisModports = thisInterface.modports[thisInterface.role];
                    if (!thisModports)
                        throw Error(`${thisInterface.name} : inconsistent modports`);
                    if (!Module.printedInterfaces[thisInterface.interfaceName()]) {
                        interfacesString += thisInterface.writeSystemVerilog();
                        Module.printedInterfaces[thisInterface.interfaceName()] = true;
                    }
                    IOArray.push(`${thisInterface.interfaceName()}.${thisInterface.role} ${key}`);
                }
                else {
                    throw Error(`${thisInterface.name} has role/modport inconsistency`);
                }
            }
            else {
                signalArray.push(`${thisInterface.interfaceName()} ${key}()`);
            }
        });
        const IOString = `   ${IOArray.join(',\n   ')}`;
        return { IOString, interfacesString, signalArray };
    }
    assembleSignals(signalArray, isSystemVerilog = true) {
        Object.entries(this.signals).forEach(([key, signal]) => {
            if (signal) {
                const rangeString = (signal.width || 0) > 1 ? `[${Number(signal.width) - 1}:0]` : '';
                const arrayString = signal.isArray && signal.isArray > 1 ? ` [0:${(signal.isArray || 0n) - 1n}]` : '';
                const valueString = signal.type === 'const logic' ? ` = ${(signal.value || 0n).toString()}` : '';
                const signString = signal.isSigned ? ' signed' : '';
                if (isSystemVerilog) {
                    signalArray.push(`${'logic'}${signString} ${rangeString} ${key}${arrayString}${valueString}`);
                }
                else {
                    signalArray.push(`${signal.type}${signString} ${rangeString} ${key}${arrayString}${valueString}`);
                }
            }
        });
        return signalArray.length > 0 ? `   ${signalArray.join(';\n   ')};` : '';
    }
    assembleRegisterBlocks(isSystemVerilog = true) {
        let registerBlocksString = '';
        for (const sensitivity in this.registerBlocks) {
            for (const resetCondition in this.registerBlocks[sensitivity]) {
                for (const enable in this.registerBlocks[sensitivity][resetCondition]) {
                    registerBlocksString += this.assembleRegisterBlock(sensitivity, resetCondition, enable, isSystemVerilog);
                }
            }
        }
        return registerBlocksString;
    }
    assembleRegBlksReorder(isSystemVerilog = true) {
        let regBlocksReorderString = '';
        for (const sensitivity in this.registerBlocks) {
            if (!this.regBlksReorder[sensitivity]) {
                this.regBlksReorder[sensitivity] = {};
            }
            for (const resetCondition in this.registerBlocks[sensitivity]) {
                if (!this.regBlksReorder[sensitivity][resetCondition]) {
                    this.regBlksReorder[sensitivity][resetCondition] = {};
                }
                for (const enable in this.registerBlocks[sensitivity][resetCondition]) {
                    for (const qName in this.registerBlocks[sensitivity][resetCondition][enable]) {
                        if (!this.regBlksReorder[sensitivity][resetCondition][qName]) {
                            this.regBlksReorder[sensitivity][resetCondition][qName] = {};
                        }
                        this.regBlksReorder[sensitivity][resetCondition][qName][enable] = this.registerBlocks[sensitivity][resetCondition][enable][qName];
                    }
                }
            }
        }
        for (const sensitivity in this.regBlksReorder) {
            for (const resetCondition in this.regBlksReorder[sensitivity]) {
                for (const qName in this.regBlksReorder[sensitivity][resetCondition]) {
                    regBlocksReorderString += this.assembleRegBlkReorder(sensitivity, resetCondition, qName, isSystemVerilog);
                }
            }
        }
        return regBlocksReorderString;
    }
    assembleRegisterBlock(sensitivity, resetCondition, enable, isSystemVerilog) {
        const regs = this.registerBlocks[sensitivity][resetCondition][enable];
        const resetString = this.assembleResetString(resetCondition, regs);
        const enableString = enable === '#NONE#' ? '' : `if(${enable})`;
        const functionalAssignments = this.assembleFunctionalAssignments(regs);
        const alwaysKeyword = isSystemVerilog ? 'always_ff' : 'always';
        return `
     ${alwaysKeyword} ${sensitivity}
  ${resetString}${enableString}
  begin
  ${functionalAssignments}
  end
  `;
    }
    assembleRegBlkReorder(sensitivity, resetCondition, qName, isSystemVerilog) {
        const regs = this.regBlksReorder[sensitivity][resetCondition][qName];
        const resetString = this.assembleReorderRstStr(qName, resetCondition, regs);
        let enableandFunctionString = '';
        for (const enable in regs) {
            let enableString = enable === ('#NONE#' || '') ? 'else' : `else if(${enable})`;
            if (resetString === ('   ' || '#NONE#')) {
                enableString = (enable === '#NONE#') ? '' : `if(${enable})`;
            }
            const functionalAssignments = this.assembleReorderFunctAssignment(qName, regs[enable]);
            enableandFunctionString = enableandFunctionString + `${enableString}
  begin
  ${functionalAssignments}
  end
  `;
}
const alwaysKeyword = isSystemVerilog ? 'always_ff' : 'always';
return `
${alwaysKeyword} ${sensitivity}
${resetString}${enableandFunctionString}
`;
}
assembleResetString(resetCondition, regs) {
    if (resetCondition === '#NONE#' || '')
        return '   ';
    // 此处将不同的q合并在一个Reset Block之中
    const resetAssignments = Object.entries(regs)
    .map(([key, reg]) => `           ${key} <= ${this.signals[key]?.width || this.IOs[key]?.width}'h${(reg.resetVal || 0).toString(16).toUpperCase()};`)
    .join('\n');
        return `     if(${resetCondition})
        begin
${resetAssignments}
end
      else `;
    }
    assembleReorderRstStr(qName, resetCondition, regs) {
        if (resetCondition === '#NONE#')
            return '   ';
        let resetVal = 0;
        for (const enable in regs) {
            if (regs[enable].resetVal !== undefined) {
                resetVal = regs[enable].resetVal;
                break;
            }
        }
                const resetAssignment = `${qName} <= ${this.signals[qName]?.width || this.IOs[qName]?.width}'h${resetVal.toString(16).toUpperCase()};`;
        return `
       if(${resetCondition})
       begin
    ${resetAssignment}
      end
  `;
    }
    assembleFunctionalAssignments(regs) {
        // 此处将不同的q合并在一个Assignment Block之中
        return Object.entries(regs)
            .map(([key, reg]) => `           ${key} <= ${reg.d};`)
            .join('\n');
    }
    assembleReorderFunctAssignment(qName, reg) {
        return `${qName} <= ${reg.d};`;
    }
    assembleSubmodules() {
            let definitions = '';
            let instantiations = '';
        const printed = {};
        Object.entries(this.submodules).forEach(([moduleInstance, thisSubmodule]) => {
            // Generate module definition if not already printed
            if (!printed[thisSubmodule.module.name]) {
                printed[thisSubmodule.module.name] = true;
                definitions += thisSubmodule.module.writeSystemVerilog();
            }
            // Generate module instantiation
            const paramsBind = this.assembleParamsBind(thisSubmodule);
            const bindingsString = this.assembleBindings(thisSubmodule);
            instantiations += `
      ${thisSubmodule.module.name} ${paramsBind}${moduleInstance}
      (
  ${bindingsString}
      );
  `;
        });
        return { definitions, instantiations };
    }
    assembleParamsBind(thisSubmodule) {
        const vParamsArray = Object.entries(thisSubmodule.module.verilogParams)
            .map(([p]) => {
            const param = thisSubmodule.module.params[p];
            if (typeof param === 'number' || typeof param === 'bigint') {
                return `.${p}(${param.toString()})`;
            }
            else if (typeof param === 'string') {
                return `.${p}("${param}")`;
            }
            return null;
        })
            .filter((p) => p !== null);
        return vParamsArray.length > 0 ? `#(${vParamsArray.join(',')}) ` : '';
    }
    assembleBindings(thisSubmodule) {
        return Object.entries(thisSubmodule.bindings)
            .map(([binding, value]) => `        .${binding}(${value.toString()})`)
            .join(',\n');
    }
        /**
       * write the generated SystemVerilog code to a string
       * @returns string containing the generated SystemVerilog code for this module
       */
        writeSystemVerilog() {
            const paramsString = this.assembleParameters();
            const { IOString, interfacesString, signalArray } = this.assembleIODefinition();
            const signalString = this.assembleSignals(signalArray);
            // const registerBlocksString = this.assembleRegisterBlocks()
            const regBlksReorderString = this.assembleRegBlksReorder();
            const { definitions, instantiations } = this.assembleSubmodules();
            const verilog = `
        ${interfacesString}        
        ${definitions}        
        module ${this.name} ${paramsString}
           (
        ${IOString}
           );
        
        ${signalString}
        
        ${this.body}
    
        ${instantiations}
    
        ${regBlksReorderString}
        
        endmodule        
        `;
            return verilog;
        }
        writeVerilog() {
            // assemble TSSVParameters
            const paramsString = this.assembleParameters();
            // construct IO definition
            const { IOString, interfacesString, signalArray } = this.assembleIODefinition(false);
            const signalString = this.assembleSignals(signalArray, false);
            // const registerBlocksString = this.assembleRegisterBlocks(false)
            const regBlksReorderString = this.assembleRegBlksReorder(false);
            const { definitions, instantiations } = this.assembleSubmodules();
            const verilog = `
        ${interfacesString}        
        ${definitions}       
        module ${this.name} ${paramsString}
           (
        ${IOString}
           );
        
        ${signalString}
        
        ${this.body}
    
        ${instantiations}
    
        ${regBlksReorderString}
        
        endmodule
        `;
            return verilog;
        }
    }
    Module.printedInterfaces = {};
    export function extractNumberFromPattern(pattern) {
        const match = pattern.match(/^(\d+)'/);
        return match ? parseInt(match[1], 10) : null;
    }
    export function serialize(obj, indent, bigIntSuffix = 'n') {
        const serialized = JSON.stringify(obj, function (key, value) {
            if (typeof value === 'bigint') {
                return `0x${value.toString(16)}${bigIntSuffix}`;
            }
            return value;
        }, indent);
        return serialized;
    }
    export function deserialize(serialized) {
        const revived = JSON.parse(serialized, (key, value) => {
            const hexPattern = /^0x[0-9a-fA-F]+n$/;
            if (typeof value === 'string' && hexPattern.test(value)) {
                return BigInt(value.slice(0, -1));
            }
            return value;
        });
        return revived;
    }
    export default { Module, Sig, Expr };
/*----------------------------------------------------------------    
    writeSystemVerilog() {
        // assemble TSSVParameters
        const paramsArray = [];
        if (this.params) {
            // FIXME - need separate SV Verilog parameter container
            
        }
        let paramsString = '';
        if (paramsArray.length > 0) {
            paramsString = `    #(${paramsArray.join(',\n    ')})`;
        }
        const IOArray = [];
        const signalArray = [];
        let interfacesString = '';
        Object.keys(this.IOs).forEach((key) => {
            let rangeString = '';
            const signString = (this.IOs[key].isSigned) ? ' signed' : '';
            if (this.IOs[key].isArray)
                throw Error(`${key}: Array IOs not supported`);
            if ((this.IOs[key].width || 0) > 1) {
                rangeString = `[${Number(this.IOs[key].width) - 1}:0]`;
            }
            IOArray.push(`${this.IOs[key].direction} ${this.IOs[key].type || 'logic'}${signString} ${rangeString} ${key}`);
        });
        Object.keys(this.interfaces).forEach((key) => {
            const thisInterface = this.interfaces[key];
            if (thisInterface.role) {
                if (thisInterface.modports) {
                    const thisModports = thisInterface.modports[thisInterface.role];
                    if (!thisModports)
                        throw Error(`${thisInterface.name} : inconsistent modports`);
                    if (!Module.printedInterfaces[thisInterface.interfaceName()]) {
                        interfacesString += thisInterface.writeSystemVerilog();
                        Module.printedInterfaces[thisInterface.interfaceName()] = true;
                    }
                    IOArray.push(`${thisInterface.interfaceName()}.${thisInterface.role} ${key}`);
                }
                else {
                    throw Error(`${thisInterface.name} has role/modport inconsistency`);
                }
            }
            else {
                signalArray.push(`${thisInterface.interfaceName()} ${key}()`);
            }
        });
        const IOString = `   ${IOArray.join(',\n   ')}`;
        Object.keys(this.signals).forEach((key) => {
            const thisSignal = this.signals[key];
            if (thisSignal) {
                let rangeString = '';
                let arrayString = '';
                let valueString = '';
                const signString = (thisSignal.isSigned) ? ' signed' : '';
                if ((thisSignal.width || 0) > 1) {
                    rangeString = `[${Number(thisSignal.width) - 1}:0]`;
                }
                if (thisSignal.isArray && ((thisSignal.isArray || 0) > 1)) {
                    arrayString = ` [0:${(thisSignal.isArray || 0n) - 1n}]`;
                }
                if (thisSignal.type === 'const logic') {
                    valueString = ` = ${(thisSignal.value || 0n).toString()}`;
                }
                signalArray.push(`${'logic'}${signString} ${rangeString} ${key}${arrayString}${valueString}`);
            }
        });
        let signalString = `   ${signalArray.join(';\n   ')}`;
        if (signalArray.length > 0)
            signalString += ';';
        for (const sensitivity in this.registerBlocks) {
            for (const resetCondition in this.registerBlocks[sensitivity]) {
                for (const enable in this.registerBlocks[sensitivity][resetCondition]) {
                    const regs = this.registerBlocks[sensitivity][resetCondition][enable];
                    let resetString = '   ';
                    if (resetCondition !== '#NONE#') {
                        const resetAssignments = [];
                        Object.keys(regs).forEach((key) => {
                            const reg = regs[key];
                            resetAssignments.push(`           ${key} <= ${this.signals[key]?.width || this.IOs[key]?.width}'h${(reg.resetVal || 0).toString(16).toUpperCase()};`);
                        });
                        resetString =
                            `     if(${resetCondition})
        begin
${resetAssignments.join('\n')}
        end
      else `;
                    }
                    const enableString = (enable === '#NONE#') ? '' : `if(${enable})`;
                    const functionalAssigments = [];
                    Object.keys(regs).forEach((key) => {
                        const reg = regs[key];
                        // console.log(reg)
                        functionalAssigments.push(`           ${key} <= ${reg.d};`);
                    });
                    this.body +=
                        `
   always_ff ${sensitivity}
${resetString}${enableString}
        begin
${functionalAssigments.join('\n')}
        end
`;
                }
            }
        }
        let subModulesString = '';
        const printed = {};
        for (const moduleInstance in this.submodules) {
            const thisSubmodule = this.submodules[moduleInstance];
            let paramsBind = '';
            if (!printed[thisSubmodule.module.name]) {
                printed[thisSubmodule.module.name] = true;
                subModulesString += thisSubmodule.module.writeSystemVerilog();
            }
            const bindingsArray = [];
            for (const binding in thisSubmodule.bindings) {
                bindingsArray.push(`        .${binding}(${thisSubmodule.bindings[binding].toString()})`);
            }
            const vParamsArray = [];
            for (const p in thisSubmodule.module.verilogParams) {
                let pString;
                if ((typeof thisSubmodule.module.params[p] === 'number') ||
                    (typeof thisSubmodule.module.params[p] === 'bigint')) {
                    pString = thisSubmodule.module.params[p]?.toString();
                }
                else if (typeof thisSubmodule.module.params[p] === 'string') {
                    pString = `"${thisSubmodule.module.params[p]?.toString()}"`;
                }
                if (pString !== undefined) {
                    vParamsArray.push(`.${p}(${pString})`);
                }
            }
            if (vParamsArray.length > 0) {
                paramsBind = `#(${vParamsArray.join(',')}) `;
            }
            this.body +=
                `
    ${thisSubmodule.module.name} ${paramsBind}${moduleInstance}
      (
${bindingsArray.join(',\n')}        
      );
`;
        }
        const verilog = `
${interfacesString}        
${subModulesString}
        
module ${this.name} ${paramsString}
   (
${IOString}
   );

${signalString}

${this.body}

endmodule`;
        return verilog;
    }
    writeVerilog() {
        // assemble TSSVParameters
        const paramsArray = [];
        if (this.params) {
            // FIXME - need separate SV Verilog parameter container
            
        }
        let paramsString = '';
        if (paramsArray.length > 0) {
            paramsString = `    #(${paramsArray.join(',\n    ')})`;
        }
        // construct IO definition
        const IOArray = [];
        const signalArray = [];
        let interfacesString = '';
        Object.keys(this.IOs).forEach((key) => {
            let rangeString = '';
            const signString = (this.IOs[key].isSigned) ? ' signed' : '';
            if (this.IOs[key].isArray)
                throw Error(`${key}: Array IOs not supported`);
            if ((this.IOs[key].width || 0) > 1) {
                rangeString = `[${Number(this.IOs[key].width) - 1}:0]`;
            }
            IOArray.push(`${this.IOs[key].direction} ${signString} ${rangeString} ${key}`);
        });
        Object.keys(this.interfaces).forEach((key) => {
            const thisInterface = this.interfaces[key];
            if (thisInterface.role) {
                if (thisInterface.modports) {
                    const thisModports = thisInterface.modports[thisInterface.role];
                    if (!thisModports)
                        throw Error(`${thisInterface.name} : inconsistent modports`);
                    if (!Module.printedInterfaces[thisInterface.interfaceName()]) {
                        interfacesString += thisInterface.writeSystemVerilog();
                        Module.printedInterfaces[thisInterface.interfaceName()] = true;
                    }
                    IOArray.push(`${thisInterface.interfaceName()}.${thisInterface.role} ${key}`);
                }
                else {
                    throw Error(`${thisInterface.name} has role/modport inconsistency`);
                }
            }
            else {
                signalArray.push(`${thisInterface.interfaceName()} ${key}()`);
            }
        });
        const IOString = `   ${IOArray.join(',\n   ')}`;
        // construct signal list
        Object.keys(this.signals).forEach((key) => {
            const thisSignal = this.signals[key];
            if (thisSignal) {
                let rangeString = '';
                let arrayString = '';
                let valueString = '';
                const signString = (thisSignal.isSigned) ? ' signed' : '';
                if ((thisSignal.width || 0) > 1) {
                    rangeString = `[${Number(thisSignal.width) - 1}:0]`;
                }
                if (thisSignal.isArray && ((thisSignal.isArray || 0) > 1)) {
                    arrayString = ` [0:${(thisSignal.isArray || 0n) - 1n}]`;
                }
                if (thisSignal.type === 'const logic') {
                    valueString = ` = ${(thisSignal.value || 0n).toString()}`;
                }
                signalArray.push(`${thisSignal.type}${signString} ${rangeString} ${key}${arrayString}${valueString}`);
            }
        });
        let signalString = `   ${signalArray.join(';\n   ')}`;
        if (signalArray.length > 0)
            signalString += ';';
        for (const sensitivity in this.registerBlocks) {
            for (const resetCondition in this.registerBlocks[sensitivity]) {
                for (const enable in this.registerBlocks[sensitivity][resetCondition]) {
                    const regs = this.registerBlocks[sensitivity][resetCondition][enable];
                    let resetString = '   ';
                    if (resetCondition !== '#NONE#') {
                        const resetAssignments = [];
                        Object.keys(regs).forEach((key) => {
                            const reg = regs[key];
                            resetAssignments.push(`           ${key} <= ${this.signals[key]?.width || this.IOs[key]?.width}'h${(reg.resetVal || 0).toString(16).toUpperCase()};`);
                        });
                        resetString =
                            `     if(${resetCondition})
        begin
${resetAssignments.join('\n')}
        end
      else `;
                    }
                    const enableString = (enable === '#NONE#') ? '' : `if(${enable})`;
                    const functionalAssigments = [];
                    Object.keys(regs).forEach((key) => {
                        const reg = regs[key];
                        // console.log(reg)
                        functionalAssigments.push(`           ${key} <= ${reg.d};`);
                    });
                    this.body +=
                        `
   always ${sensitivity}
${resetString}${enableString}
        begin
${functionalAssigments.join('\n')}
        end
`;
                }
            }
        }
        let subModulesString = '';
        const printed = {};
        for (const moduleInstance in this.submodules) {
            const thisSubmodule = this.submodules[moduleInstance];
            let paramsBind = '';
            if (!printed[thisSubmodule.module.name]) {
                printed[thisSubmodule.module.name] = true;
                subModulesString += thisSubmodule.module.writeVerilog();
            }
            const bindingsArray = [];
            for (const binding in thisSubmodule.bindings) {
                bindingsArray.push(`        .${binding}(${thisSubmodule.bindings[binding].toString()})`);
            }
            const vParamsArray = [];
            for (const p in thisSubmodule.module.verilogParams) {
                let pString;
                if ((typeof thisSubmodule.module.params[p] === 'number') ||
                    (typeof thisSubmodule.module.params[p] === 'bigint')) {
                    pString = thisSubmodule.module.params[p]?.toString();
                }
                else if (typeof thisSubmodule.module.params[p] === 'string') {
                    pString = `"${thisSubmodule.module.params[p]?.toString()}"`;
                }
                if (pString !== undefined) {
                    vParamsArray.push(`.${p}(${pString})`);
                }
            }
            if (vParamsArray.length > 0) {
                paramsBind = `#(${vParamsArray.join(',')}) `;
            }
            this.body +=
                `
    ${thisSubmodule.module.name} ${paramsBind}${moduleInstance}
      (
${bindingsArray.join(',\n')}        
      );
`;
        }
        const verilog = `
${interfacesString}        
${subModulesString}
        
module ${this.name} ${paramsString}
   (
${IOString}
   );

${signalString}

${this.body}

endmodule`;
        return verilog;
    }
}
Module.printedInterfaces = {};
export function serialize(obj, indent, bigIntSuffix = 'n') {
    const serialized = JSON.stringify(obj, function (key, value) {
        if (typeof value === 'bigint') {
            return `0x${value.toString(16)}${bigIntSuffix}`;
        }
        return value;
    }, indent);
    return serialized;
}
export function deserialize(serialized) {
    const revived = JSON.parse(serialized, (key, value) => {
        const hexPattern = /^0x[0-9a-fA-F]+n$/;
        if (typeof value === 'string' && hexPattern.test(value)) {
            return BigInt(value.slice(0, -1));
        }
        return value;
    });
    return revived;
}
export default { Module, Sig, Expr };
*/
