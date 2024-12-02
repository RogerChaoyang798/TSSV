import { Module, Expr } from 'tssv/lib/core/TSSV';
import { Memory } from 'tssv/lib/interfaces/Memory';
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4';
export class RegAddr {
    constructor(start, wordSize) {
        this.addr = start || 0n;
        this.stride = BigInt((wordSize || 32) / 8);
    }
    next() {
        const nextAddr = this.addr;
        this.addr += this.stride;
        return nextAddr;
    }
}
/**
 * WRITE
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": " data_wr", "wave": "03........", "data": ["D"]},
 *     {"name": "    addr", "wave": "04........", "data": ["A"]},
 *     {"name": "      we", "wave": "01.0......"},
 *     {"name": "      re", "wave": "0........."},
 *     {"name": " data_rd", "wave": "0........."},
 *     {"name": "   ready", "wave": "10.1......"}
 *   ]
 * }
 * ```
 */
/**
 * READ
 *
 * @wavedrom
 * ```json
 * {
 *   "signal": [
 *     {"name": "     clk", "wave": "p........."},
 *     {"name": " data_wr", "wave": "0........."},
 *     {"name": "    addr", "wave": "04........", "data": ["A"]},
 *     {"name": "      we", "wave": "0........."},
 *     {"name": "      re", "wave": "01.0......"},
 *     {"name": " data_rd", "wave": "0.......5.", "data": ["D"]},
 *     {"name": "   ready", "wave": "10......1."}
 *   ]
 * }
 * ```
 */
export class RegisterBlock extends Module {
    constructor(params, regDefs, busInterface) {
        super({
            name: params.name,
            busInterface: params.busInterface || 'Memory',
            endianess: params.endianess || 'little'
        });
        this.regDefs = regDefs;
        // Define IO signals
        this.IOs = {
            clk: { direction: 'input', isClock: 'posedge' },
            rst_b: { direction: 'input', isReset: 'lowasync' }
        };
        if (!((busInterface instanceof Memory) || (busInterface instanceof APB4) || typeof busInterface === 'object')) {
            throw Error('Unsupported interface');
        }
        if (busInterface instanceof Memory) {
            this.addInterface('regs', new Memory({
                DATA_WIDTH: regDefs.wordSize || 32,
                ADDR_WIDTH: params.busAddressWidth
            }, 'inward'));
            for (const reg in this.regDefs.addrMap) {
                const regName = reg;
                const registers = this.regDefs.registers;
                const baseAddr = this.regDefs.addrMap[regName];
                const matchExpr = this.addSignal(`${regName}_matchExpr`, { width: 1 });
                let thisReg = {
                    type: 'RW',
                    width: regDefs.wordSize
                };
                if (registers[regName] !== undefined) {
                    thisReg = registers[regName] || thisReg;
                }
                if (thisReg.type === 'RW') {
                    const wstrbWidth = (params.busAddressWidth || 8) / 8;
                    const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth });
                    // Use original address for logic
                    this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr });
                    const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 });
                    const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 });
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig });
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig });
                    // new code
                    this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb });
                    if (thisReg.fields && Object.keys(thisReg.fields).length > 0) {
                        Object.keys(thisReg.fields).forEach((fieldName, index) => {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            const field = thisReg.fields[fieldName];
                            const fieldSigName = `${regName}_field${index}`;
                            this.IOs[fieldSigName] = {
                                direction: 'output',
                                width: field.bitRange[0] - field.bitRange[1] + 1,
                                isSigned: field.isSigned
                            };
                            this.addRegister({
                                d: new Expr(`regs.DATA_WR[${field.bitRange[0]}:${field.bitRange[1]}]`),
                                clk: 'clk',
                                reset: 'rst_b',
                                q: fieldSigName,
                                en: `${regName}_WE && ${wstrb.toString()}`, // added && ${wstrb.toString()}
                                resetVal: field.reset || 0n
                            });
                        });
                    }
                    else {
                        this.IOs[regName.toString()] = {
                            direction: 'output',
                            width: thisReg.width || regDefs.wordSize,
                            isSigned: thisReg.isSigned
                        };
                        this.addSignal(`${regName}_d`, { width: regDefs.wordSize });
                        this.addAssign({ in: new Expr(`regs.DATA_WR & ${wstrb.toString()}`), out: `${regName}_d` });
                        this.addRegister({
                            d: 'regs.DATA_WR', // added & wstrb
                            clk: 'clk',
                            reset: 'rst_b',
                            q: regName.toString(),
                            en: `${regName}_WE`,
                            resetVal: thisReg.reset || 0n
                        });
                    }
                }
                else if (thisReg.type === 'RO') {
                    // Use original address for logic
                    this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr });
                    const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 });
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig });
                    this.IOs[regName.toString()] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                }
                else if (thisReg.type === 'WO') {
                    const wstrbWidth = (params.busAddressWidth || 8) / 8;
                    const wstrb = this.addSignal(`${regName}_wstrb`, { width: wstrbWidth });
                    // Use original address for logic
                    this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr });
                    this.addAssign({ in: new Expr('regs.WSTRB'), out: wstrb });
                    const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 });
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig });
                    this.IOs[regName.toString()] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                    this.addAssign({ in: new Expr('regs.DATA_WR'), out: regName.toString() });
                }
                else if (thisReg.type === 'ROM') {
                    // Use original address for logic
                    if (thisReg.size) {
                        this.addAssign({ in: new Expr(`(regs.ADDR >= ${baseAddr}) && (regs.ADDR <= (${Number(baseAddr.valueOf()) + ((Number(thisReg.size) * 4) - 1)}))`), out: matchExpr });
                    }
                    else {
                        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr });
                    }
                    const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 });
                    const ROM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth });
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig });
                    this.addAssign({ in: new Expr('regs.ADDR'), out: ROM_ADDR });
                    this.IOs[`${regName}_rdata`] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                    this.IOs[`${regName}_re`] = {
                        direction: 'output',
                        width: 1
                    };
                    this.IOs[`${regName}_ready`] = {
                        direction: 'output',
                        width: 1
                    };
                    this.addRegister({
                        d: 'regs.READY',
                        clk: 'clk',
                        reset: 'rst_b',
                        en: 'regs.WE',
                        q: `${regName}_ready`
                    });
                }
                else if (thisReg.type === 'RAM') {
                    // Use original address for logic
                    if (thisReg.size) {
                        this.addAssign({ in: new Expr(`(regs.ADDR >= ${baseAddr}) && (regs.ADDR <= (${Number(baseAddr.valueOf()) + ((Number(thisReg.size) * 4) - 1)}))`), out: matchExpr });
                    }
                    else {
                        this.addAssign({ in: new Expr(`regs.ADDR == ${baseAddr}`), out: matchExpr });
                    }
                    const DEC_MASK = this.calculateDecMask(thisReg.size);
                    // const PASS_MASK = this.calculatePassMask(thisReg.size)
                    const Nmatch = this.addSignal(`${regName}_Nmatch`, { width: 1 });
                    const RAM_ADDR = this.addSignal(`${regName}_ADDR`, { width: params.busAddressWidth });
                    const RE_Sig = this.addSignal(`${regName}_RE`, { width: 1 });
                    const WE_Sig = this.addSignal(`${regName}_WE`, { width: 1 });
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    this.addAssign({ in: new Expr(`regs.ADDR & ${DEC_MASK} == ${baseAddr}`), out: Nmatch });
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.RE`), out: RE_Sig }); // changed from Nmatch
                    this.addAssign({ in: new Expr(`${matchExpr.toString()} && regs.WE`), out: WE_Sig }); // changed from Nmatch
                    this.addAssign({ in: new Expr('regs.ADDR'), out: RAM_ADDR }); // remove  & ${PASS_MASK}
                    this.IOs[`${regName}_rdata`] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                    this.IOs[`${regName}_re`] = {
                        direction: 'output',
                        width: 1
                    };
                    this.IOs[`${regName}_we`] = {
                        direction: 'output',
                        width: 1
                    };
                    this.IOs[`${regName}_wdata`] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned
                    };
                    this.IOs[`${regName}_wstrb`] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize
                    };
                    this.IOs[`${regName}_ready`] = {
                        direction: 'output',
                        width: 1
                    };
                    this.addRegister({
                        d: 'regs.READY',
                        clk: 'clk',
                        reset: 'rst_b',
                        en: `${regName}_WE`,
                        q: `${regName}_ready`
                    });
                    this.addRegister({
                        d: 'regs.DATA_WR',
                        clk: 'clk',
                        reset: 'rst_b',
                        en: `${regName}_WE`,
                        q: `${regName}_wdata`
                    });
                    this.addRegister({
                        d: RE_Sig,
                        clk: 'clk',
                        reset: 'rst_b',
                        en: `${regName}_WE`,
                        q: `${regName}_re`
                    });
                    this.addRegister({
                        d: WE_Sig,
                        clk: 'clk',
                        reset: 'rst_b',
                        en: `${regName}_WE`,
                        q: `${regName}_we`
                    });
                    this.addRegister({
                        d: new Expr('1'), // Assuming a simple write strobe signal
                        clk: 'clk',
                        reset: 'rst_b',
                        en: `${regName}_WE`,
                        q: `${regName}_wstrb`
                    });
                }
            }
            let readyStr = '';
            const inputs = [];
            let casexString = `
  always @(regs.ADDR or regs.RE)
    if(regs.RE == 1) begin
      /* verilator lint_off CASEX */
      casex (regs.ADDR)
   `;
            for (const reg in this.regDefs.addrMap) {
                const regName = reg;
                const baseAddr = this.regDefs.addrMap[regName];
                let readSignal = '';
                const register = this.regDefs.registers?.[regName];
                if (register?.type === 'ROM') { //  || register?.type === 'RAM'
                    readSignal = `${regName}_rdata`;
                    inputs.push(`${regName}_rdata`);
                    readyStr = `${regName}_ready`;
                    casexString +=
                        `     8'b${this.padZeroes(this.replaceZerosWithX(baseAddr.toString(2)), 8)}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= ${readyStr};
        end\n`;
                }
                else if (register?.type === 'RAM') {
                    readSignal = `${regName}_wdata`;
                    inputs.push(`${regName}_rdata`);
                    readyStr = `${regName}_ready`;
                    casexString +=
                        `     8'b${this.padZeroes(this.replaceZerosWithX(baseAddr.toString(2)), 8)}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= ${readyStr};
        end\n`;
                }
                else if (register?.type === 'RO') {
                    readSignal = regName;
                    inputs.push(`${regName}`);
                    readyStr = '1\'b1';
                    casexString +=
                        `     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= ${readyStr};
        end\n`;
                }
                else if (register?.type === 'RW') {
                    if (register.fields && Object.keys(register.fields).length > 0) {
                        readSignal = Object.keys(register.fields).map((fieldName, index) => `${regName}_field${index}`).reverse().join(', ');
                        readSignal = `{${readSignal}}`;
                        inputs.push(`${regName}_field0`);
                        inputs.push(`${regName}_field1`);
                        readyStr = '1\'b1';
                        casexString +=
                            `     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= ${readyStr};
        end\n`;
                    }
                    else {
                        readSignal = regName;
                        inputs.push(`${regName}`);
                        readyStr = '1\'b1';
                        casexString +=
                            `     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= ${readyStr};
        end\n`;
                    }
                }
                else {
                    readSignal = regName;
                    inputs.push(`${regName}`);
                    casexString +=
                        `     8'b${this.padZeroes(baseAddr.toString(2), 8)}: begin
            regs.DATA_RD <= ${readSignal};
            regs.READY <= ${readyStr};
        end\n`;
                }
            }
            casexString += '      default: regs.DATA_RD <= 0;\n';
            casexString += '    endcase\n';
            casexString += '  end';
            // Add the casex string to the body
            this.body += casexString;
        }
        else if (busInterface instanceof APB4) {
            const useComb = true;
            this.addInterface('regs', new APB4({
                DATA_WIDTH: regDefs.wordSize || 32,
                ADDR_WIDTH: params.busAddressWidth
            }, 'inward'));
            // Create signals and logic for this register block
            const reg_rd = this.addSignal('reg_rd', { width: 1 });
            const reg_wr = this.addSignal('reg_wr', { width: 1 });
            const reg_addr = this.addSignal('reg_addr', { width: params.busAddressWidth || 12 });
            const reg_rdata = this.addSignal('reg_rdata', { width: regDefs.wordSize || 32 });
            const reg_wdata = this.addSignal('reg_wdata', { width: regDefs.wordSize || 32 });
            const next_rdata = this.addSignal('next_rdata', { width: regDefs.wordSize || 32 });
            let next_rdataExpr = new Expr('');
            const inRange = this.addSignal('in_range', { width: 1 });
            let inRangeExpr = new Expr('');
            const clrzeros = this.addSignal('clrzeros', { width: regDefs.wordSize || 32 });
            this.addAssign({ in: new Expr(`${regDefs.wordSize || 32}'h0`), out: 'clrzeros' });
            this.body += '// apb interface\n';
            if (useComb) {
                this.addCombAlways({
                    outputs: ['reg_wr', 'reg_rd', 'regs.PREADY', 'regs.PSTRB']
                }, `begin
reg_wr = regs.PSELx && regs.PENABLE && regs.PWRITE;
reg_rd = regs.PSELx && !regs.PENABLE && !regs.PWRITE;
reg_addr = regs.PADDR;
reg_wdata = regs.PWDATA;
regs.PRDATA = reg_rdata;
  
regs.PREADY = 1'b1;
end

`);
            }
            else {
                this.addAssign({ in: new Expr(reg_rdata.toString()), out: 'regs.PRDATA' });
                this.addAssign({ in: new Expr('regs.PSELx && regs.PENABLE && regs.PWRITE'), out: reg_wr });
                this.addAssign({ in: new Expr('regs.PSELx && !regs.PENABLE && !regs.PWRITE'), out: reg_rd });
                this.addAssign({ in: new Expr('1\'b1'), out: 'regs.PREADY' });
            }
            this.addSignal('slverr', { width: 1 });
            this.addAssign({ in: new Expr('regs.PSELx && !in_range'), out: 'slverr' });
            this.addRegister({
                d: 'slverr',
                clk: 'clk',
                reset: 'rst_b',
                q: 'regs.PSLVERR',
                resetVal: 0n
            });
            // Create signals and logic for each register
            for (const reg in this.regDefs.addrMap) {
                const regName = reg.toLowerCase();
                const registers = this.regDefs.registers;
                const baseAddr = this.regDefs.addrMap[reg];
                let thisReg = {
                    type: 'RW',
                    width: regDefs.wordSize || 32
                };
                if (registers[reg] !== undefined) {
                    thisReg = registers[reg] || thisReg;
                }
                const matchExpr = this.addSignal(`dec_${regName}`, { width: 1 });
                this.addAssign({ in: new Expr(`(reg_addr == ${params.busAddressWidth}'h${this.padZeroes(baseAddr.toString(16).toUpperCase(), (params.busAddressWidth || 32) / 4)}) ? 1'd1 : 1'd0`), out: matchExpr });
                const pkExpr = this.addSignal(`reg_${regName}`, { width: regDefs.wordSize || 32 });
                if (thisReg.type === 'RW') {
                    const RE_Sig = this.addSignal(`${regName}_re`, { width: 1 });
                    const WE_Sig = this.addSignal(`${regName}_we`, { width: 1 });
                    this.addAssign({ in: new Expr(`reg_rd && ${matchExpr.toString()}`), out: RE_Sig });
                    this.addAssign({ in: new Expr(`reg_wr && ${matchExpr.toString()}`), out: WE_Sig });
                    this.body += '// non-RO: output\n';
                    this.IOs['cfg_' + regName.toString()] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned || false
                    };
                    this.addAssign({ in: new Expr(pkExpr.toString()), out: `cfg_${regName}` });
                    this.addRegister({
                        d: reg_wdata,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: pkExpr,
                        en: WE_Sig,
                        resetVal: thisReg.reset || 0n
                    });
                    const readSignal = { a: matchExpr, b: pkExpr };
                    next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), 'RW', regDefs.wordSize || 32));
                    inRangeExpr = new Expr(this.addInRange({ a: matchExpr, b: inRangeExpr.toString() }));
                }
                else if (thisReg.type === 'WO') {
                    const SC_Sig = this.addSignal(`${regName}_sc`, { width: 1 });
                    const WE_Sig = this.addSignal(`${regName}_we`, { width: 1 });
                    this.addAssign({ in: new Expr(`reg_wr && ${matchExpr.toString()}`), out: WE_Sig });
                    const readSignal = { a: matchExpr, b: '32\'h0' };
                    next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), 'WO', regDefs.wordSize || 32));
                    inRangeExpr = new Expr(this.addInRange({ a: matchExpr, b: inRangeExpr.toString() }));
                    this.body += '// non-RO: output\n';
                    this.IOs[`cfg_${regName}`] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned || false
                    };
                    this.addAssign({ in: new Expr(pkExpr.toString()), out: `cfg_${regName}` });
                    // this.body += '// WO self clear reg\n'
                    this.addRegister({
                        d: reg_wdata,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: pkExpr,
                        en: WE_Sig,
                        resetVal: thisReg.reset || 0n
                    });
                    this.addRegister({
                        d: clrzeros,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: pkExpr,
                        en: SC_Sig,
                        resetVal: thisReg.reset || 0n
                    });
                    this.addRegister({
                        d: SC_Sig,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: SC_Sig,
                        resetVal: 0n
                    });
                }
                else if (thisReg.type === 'RO') {
                    // Use original address for logic
                    this.body += '// RO reg: input\n';
                    this.IOs['cfg_' + regName.toString()] = {
                        direction: 'input',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned || false
                    };
                    this.addAssign({ in: new Expr(`cfg_${regName}`), out: pkExpr });
                    const readSignal = { a: matchExpr, b: pkExpr };
                    next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), 'RO', regDefs.wordSize || 32));
                    inRangeExpr = new Expr(this.addInRange({ a: matchExpr, b: inRangeExpr.toString() }));
                }
            }
            this.body += '// address decode\n';
            this.addAssign({ in: inRangeExpr, out: inRange });
            this.body += '// Read data mux\n';
            this.addAssign({ in: next_rdataExpr, out: next_rdata });
            // 'default: pslverr<= regs.PSELx && !in_range;\n'
            this.addRegister({
                d: next_rdata,
                clk: 'clk',
                reset: 'rst_b',
                q: reg_rdata,
                en: reg_rd,
                resetVal: 0n
            });
        }
        else {
            this.IOs = {
                ...this.IOs,
                paddr: { direction: 'input', width: params.busAddressWidth || 12 },
                pwdata: { direction: 'input', width: regDefs.wordSize || 32 },
                prdata: { direction: 'output', width: regDefs.wordSize || 32 },
                psel: { direction: 'input', width: 1 },
                penable: { direction: 'input', width: 1 },
                pwrite: { direction: 'input', width: 1 },
                pready: { direction: 'output', width: 1 },
                pslverr: { direction: 'output', width: 1 }
            };
            // Create signals and logic for this register block
            const reg_rd = this.addSignal('reg_rd', { width: 1 });
            const reg_wr = this.addSignal('reg_wr', { width: 1 });
            const reg_addr = this.addSignal('reg_addr', { width: params.busAddressWidth || 12 });
            const reg_rdata = this.addSignal('reg_rdata', { width: regDefs.wordSize || 32 });
            const reg_wdata = this.addSignal('reg_wdata', { width: regDefs.wordSize || 32 });
            const next_rdata = this.addSignal('next_rdata', { width: regDefs.wordSize || 32 });
            let next_rdataExpr = new Expr('');
            const inRange = this.addSignal('in_range', { width: 1 });
            let inRangeExpr = new Expr('');
            const clrzeros = this.addSignal('clrzeros', { width: regDefs.wordSize || 32 });
            this.addAssign({ in: new Expr(`${regDefs.wordSize || 32}'h0`), out: 'clrzeros' });
            this.body += '// apb interface\n';
            this.addCombAlways({
                outputs: ['reg_wr', 'reg_rd', 'reg_addr', 'reg_wdata', 'prdata', 'pready']
            }, `begin
reg_wr = psel && penable && pwrite;
reg_rd = psel && !penable && !pwrite;
reg_addr = paddr;
reg_wdata = pwdata;
prdata = reg_rdata;
  
pready = 1'b1;
end

`);
            this.addSignal('slverr', { width: 1 });
            this.addAssign({ in: new Expr('psel && !in_range'), out: 'slverr' });
            this.addRegister({
                d: 'slverr',
                clk: 'clk',
                reset: 'rst_b',
                q: 'pslverr',
                resetVal: 0n
            });
            // Create signals and logic for each register
            for (const reg in this.regDefs.addrMap) {
                const regName = reg.toLowerCase();
                const registers = this.regDefs.registers;
                const baseAddr = this.regDefs.addrMap[reg];
                let thisReg = {
                    type: 'RW',
                    width: regDefs.wordSize || 32
                };
                if (registers[reg] !== undefined) {
                    thisReg = registers[reg] || thisReg;
                }
                const matchExpr = this.addSignal(`dec_${regName}`, { width: 1 });
                this.addAssign({ in: new Expr(`(reg_addr == ${params.busAddressWidth}'h${this.padZeroes(baseAddr.toString(16).toUpperCase(), (params.busAddressWidth || 32) / 4)}) ? 1'd1 : 1'd0`), out: matchExpr });
                const pkExpr = this.addSignal(`reg_${regName}`, { width: regDefs.wordSize || 32 });
                if (thisReg.type === 'RW') {
                    const WE_Sig = this.addSignal(`${regName}_we`, { width: 1 });
                    this.addAssign({ in: new Expr(`reg_wr && ${matchExpr.toString()}`), out: WE_Sig });
                    this.body += '// non-RO: output\n';
                    this.IOs['cfg_' + regName.toString()] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned || false
                    };
                    this.addAssign({ in: new Expr(pkExpr.toString()), out: `cfg_${regName}` });
                    this.addRegister({
                        d: reg_wdata,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: pkExpr,
                        en: WE_Sig,
                        resetVal: thisReg.reset || 0n
                    });
                    const readSignal = { a: matchExpr, b: pkExpr };
                    next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), 'RW', regDefs.wordSize || 32));
                    inRangeExpr = new Expr(this.addInRange({ a: matchExpr, b: inRangeExpr.toString() }));
                }
                else if (thisReg.type === 'WO') {
                    const SC_Sig = this.addSignal(`${regName}_sc`, { width: 1 });
                    const WE_Sig = this.addSignal(`${regName}_we`, { width: 1 });
                    this.addAssign({ in: new Expr(`reg_wr && ${matchExpr.toString()}`), out: WE_Sig });
                    const readSignal = { a: matchExpr, b: '32\'h0' };
                    next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), 'WO', regDefs.wordSize || 32));
                    inRangeExpr = new Expr(this.addInRange({ a: matchExpr, b: inRangeExpr.toString() }));
                    this.body += '// non-RO: output\n';
                    this.IOs[`cfg_${regName}`] = {
                        direction: 'output',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned || false
                    };
                    this.addAssign({ in: new Expr(pkExpr.toString()), out: `cfg_${regName}` });
                    // this.body += '// WO self clear reg\n'
                    this.addRegister({
                        d: reg_wdata,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: pkExpr,
                        en: WE_Sig,
                        resetVal: thisReg.reset || 0n
                    });
                    this.addRegister({
                        d: clrzeros,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: pkExpr,
                        en: SC_Sig,
                        resetVal: thisReg.reset || 0n
                    });
                    this.addRegister({
                        d: SC_Sig,
                        clk: 'clk',
                        reset: 'rst_b',
                        q: SC_Sig,
                        resetVal: 0n
                    });
                }
                else if (thisReg.type === 'RO') {
                    // Use original address for logic
                    this.body += '// RO reg: input\n';
                    this.IOs['cfg_' + regName.toString()] = {
                        direction: 'input',
                        width: thisReg.width || regDefs.wordSize,
                        isSigned: thisReg.isSigned || false
                    };
                    this.addAssign({ in: new Expr(`cfg_${regName}`), out: pkExpr });
                    const readSignal = { a: matchExpr, b: pkExpr };
                    next_rdataExpr = new Expr(this.addReadMux(readSignal, next_rdataExpr.toString(), 'RO', regDefs.wordSize || 32));
                    inRangeExpr = new Expr(this.addInRange({ a: matchExpr, b: inRangeExpr.toString() }));
                }
            }
            this.body += '// address decode\n';
            this.addAssign({ in: inRangeExpr, out: inRange });
            this.body += '// Read data mux\n';
            this.addAssign({ in: next_rdataExpr, out: next_rdata });
            // 'default: pslverr<= regs.PSELx && !in_range;\n'
            this.addRegister({
                d: next_rdata,
                clk: 'clk',
                reset: 'rst_b',
                q: reg_rdata,
                en: reg_rd,
                resetVal: 0n
            });
        }
    }
    addReadMux(io, outExpr, regType, wordSize) {
        const readSignal = `( {${wordSize}{${io.a.toString()}}} & ${io.b.toString()} )`;
        if (outExpr !== '') {
            const modifiedReadExpr = ` |\n${readSignal}`;
            outExpr += modifiedReadExpr;
        }
        else {
            outExpr += `\n${readSignal}`;
        }
        return outExpr;
    }
    addInRange(io) {
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
    replaceZerosWithX(binaryStr) {
        // Replace all '0's with 'X's
        let modifiedStr = binaryStr.replace(/0/g, 'X');
        // Check if there is no '1' in the string
        if (!modifiedStr.includes('1')) {
            modifiedStr += 'X';
        }
        return modifiedStr;
    }
    padZeroes(address, width) {
        const padLength = width - address.length;
        if (padLength <= 0)
            return address;
        return '0'.repeat(padLength) + address;
    }
    padZeroesRight(address, width) {
        const padLength = width - address.length;
        if (padLength <= 0)
            return address;
        return address + '0'.repeat(padLength);
    }
    calculateDecMask(size) {
        if (size === undefined)
            return '0';
        const sizeBits = size.toString(2).length;
        return `${sizeBits}'b${'1'.repeat(sizeBits / 2).padEnd(sizeBits, '0')}`;
    }
    calculatePassMask(size) {
        if (size === undefined)
            return '0';
        const sizeBits = size.toString(2).length;
        return `${sizeBits}'b${'0'.repeat(sizeBits / 2).padEnd(sizeBits, '1')}`;
    }
}
