import { RegisterBlock } from 'tssv/lib/core/Registers';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
const __dirname = dirname(fileURLToPath(import.meta.url));
const getCommitId = () => {
    try {
      const tssvDir = __dirname;
      return execSync('git rev-parse HEAD', { cwd: tssvDir }).toString().trim();
    } catch (err) {
      console.error('Failed to get Git commit ID:', err.message);
      return 'unknown_commit';
    }
};
const commitId = getCommitId();
// const regsPath = process.argv[2];
// const outputSvFilePath = process.argv[3];
// const regName = path.basename(outputSvFilePath, path.extname(outputSvFilePath));

const WORD_SIZE = 32;
function parseRegisterData(regsPath) {
    return JSON.parse(fs.readFileSync(regsPath, 'utf8'));
}
function createRegisterMap(regs) {
    return Object.entries(regs).reduce((acc, [regName, regDetails]) => {
        acc[regName] = BigInt(regDetails.startAddr);
        return acc;
    }, {});
}
function createRegisters(regs) {
    return Object.entries(regs).reduce((acc, [regName, regData]) => {
        acc[regName] = {
            type: regData.type,
            reset: BigInt(regData.reset),
            description: regData.description
        };
        return acc;
    }, {});
}
// const regs = JSON.parse(fs.readFileSync(regsPath, 'utf8'));
// const myRegMap = Object.entries(regs).reduce((acc, [regName, regDetails]) => {
//     acc[regName] = BigInt(regDetails.startAddr);
//     return acc;
// }, {});
// const registers = {};
// for (const [regName, regData] of Object.entries(regs)) {
//     registers[regName] = {
//         type: regData.type,
//         reset: BigInt(regData.reset),
//         description: regData.description
//     };
// }
// const myRegs = {
//     wordSize: 32,
//     addrMap: myRegMap,
//     registers
// };



// try {
//     const modifySignalTypes = (content) => {
//         const dynamicPattern = new RegExp(`^logic\s+\[${myRegs.wordSize - 1}:0\]\s+(reg_[A-Z0-9][A-Za-z0-9_]*)\s*`);
//         return content
//             .split('\n')
//             .map(line => {
//             const trimmedLine = line.trim();
//             const match = trimmedLine.match(dynamicPattern);
//             if (match) {
//                 const signalName = match[1];
//                 return trimmedLine.replace(dynamicPattern, `${signalName}_t ${signalName};`);
//             }
//             return trimmedLine;
//         })
//             .join('\n');
//     };
//     const rawVerilog = testRegBlock.writeSystemVerilog();
//     let adjustedVerilog = modifySignalTypes(rawVerilog);
//     const importStatement = `import ${testRegBlock.name}_pkg::*;`;
//     adjustedVerilog = `${importStatement}

// // =============================================================================
// // Generated Register Block 1.0
// // =============================================================================

// // Commit ID: ${commitId}
// ` +
//         adjustedVerilog + ` : ${testRegBlock.name}_pkg
// `;
//     fs.writeFileSync(outputSvFilePath, adjustedVerilog);
// }
// catch (err) {
//     console.error(err);
// }
function modifySignalTypes(content, wordSize) {
    const dynamicPattern = new RegExp(`^logic\s+\[${myRegs.wordSize - 1}:0\]\s+(reg_[A-Z0-9][A-Za-z0-9_]*)\s*`);
    return content
        .split('\n')
        .map(line => {
        const trimmedLine = line.trim();
        if (!(trimmedLine.includes('reg_wdata') || trimmedLine.includes('*reg_rdata*'))) {
            const match = trimmedLine.match(dynamicPattern);
            if (match) {
                const signalName = match[1];
                return trimmedLine.replace(dynamicPattern, `${signalName}_t ${signalName};`);
            }
        }
        return trimmedLine;
    })
        .join('\n');
}
function generateSVerilog(testRegBlock, outputSvFilePath) {
    const rawVerilog = testRegBlock.writeSystemVerilog();
    let adjustedVerilog = modifySignalTypes(rawVerilog, WORD_SIZE);
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    adjustedVerilog = `${importStatement}

// =============================================================================
// Register module
// =============================================================================
${adjustedVerilog} : ${testRegBlock.name}_pkg
`;
    fs.writeFileSync(outputSvFilePath, adjustedVerilog);
}
function generateVerilog(testRegBlock, outVFilePath) {
    const rawVerilog = testRegBlock.writeVerilog();
    let adjustedVerilog = modifySignalTypes(rawVerilog, WORD_SIZE);
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    adjustedVerilog = `${importStatement}

// =============================================================================
// Register module
// =============================================================================
${adjustedVerilog} : ${testRegBlock.name}_pkg
`;
    fs.writeFileSync(outVFilePath, adjustedVerilog);
}
function main() {
    const regsPath = process.argv[2];
    const outputSvFilePath = process.argv[3];
    const regName = path.basename(outputSvFilePath, path.extname(outputSvFilePath));

    const outVFilePath = outputSvFilePath.replace('.sv', '.v');
    const regs = parseRegisterData(regsPath);
    const myRegMap = createRegisterMap(regs);
    const registers = createRegisters(regs);

    const myRegs = {
        wordSize: WORD_SIZE,
        addrMap: myRegMap,
        registers
    };
    const testRegBlock = new RegisterBlock({
        name: regName,
        busAddressWidth: 12
    }, myRegs, {});
    
    const testRegBlockV = new RegisterBlock({
        name: regName,
        busAddressWidth: 12
    }, myRegs, {});

    try {
        generateSVerilog(testRegBlock, outputSvFilePath);
        generateVerilog(testRegBlockV, outVFilePath);
        console.log(`SystemVerilog file generated successfully: ${outputSvFilePath}`);
        console.log(`Verilog file generated successfully: ${outVFilePath}`);
    }
    catch (err) {
        console.error('Error generating Verilog file:', err);
    }
}
main();
