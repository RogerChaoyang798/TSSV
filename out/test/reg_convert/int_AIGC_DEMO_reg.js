import { RegisterBlock } from 'tssv/lib/core/Registers';
import * as fs from 'fs';
const regsPath = process.argv[2];
const outputSvFilePath = process.argv[3];
const regs = JSON.parse(fs.readFileSync(regsPath, 'utf8'));
const myRegMap = Object.entries(regs).reduce((acc, [regName, regDetails]) => {
    acc[regName] = BigInt(regDetails.startAddr);
    return acc;
}, {});
const registers = {};
for (const [regName, regData] of Object.entries(regs)) {
    registers[regName] = {
        type: regData.type,
        reset: BigInt(regData.reset),
        description: regData.description
    };
}
const myRegs = {
    wordSize: 32,
    addrMap: myRegMap,
    registers
};
const testRegBlock = new RegisterBlock({
    name: 'AIGC_DEMO_reg',
    busAddressWidth: 12
}, myRegs, {});
try {
    const modifySignalTypes = (content) => {
        const dynamicPattern = new RegExp(`^logic\\s+\\[${myRegs.wordSize - 1}:0\\]\\s+(reg_(?!rdata|wdata)[a-z0-9][a-z0-9_]*)\\s*`);
        return content
            .split('\n')
            .map(line => {
            const trimmedLine = line.trim();
            const match = trimmedLine.match(dynamicPattern);
            if (match) {
                let signalName = match[1];
                signalName = signalName.replace(/^reg_/, '');
                const debugPattern = /^(debug_\d)_(\d)$/
                let packName =''
                if (debugPattern.test(signalName)) {
                    packName = signalName.replace(debugPattern, '$1'); 
                    packName = `${packName}_t`
                    return trimmedLine.replace(dynamicPattern, `${packName} ${signalName}`);
                } else {
                    return trimmedLine.replace(dynamicPattern, `${signalName}_t ${signalName}`);
                }
                
            }
            return trimmedLine;
        })
            .join('\n');
    };
    const rawVerilog = testRegBlock.writeSystemVerilog();
    let adjustedVerilog = modifySignalTypes(rawVerilog);
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    adjustedVerilog = `${importStatement}

// =============================================================================
// Register module
// =============================================================================` +
        adjustedVerilog + ` : ${testRegBlock.name}_pkg
`;
    fs.writeFileSync(outputSvFilePath, adjustedVerilog);
}
catch (err) {
    console.error(err);
}
