import * as fs from 'fs';
// const registers = JSON.parse(fs.readFileSync('AIGC_DEMO_reg.json', 'utf8'))
const svFile = fs.createWriteStream('sv-examples/AIGC_DEMO_reg_pkg.sv');
svFile.write('package AIGC_DEMO_reg_pkg;\n\n');
svFile.write('// =============================================================================\n');
svFile.write('// Register bit field definition\n');
svFile.write('// =============================================================================\n\n');
function generateStruct(registerName, register) {
    const fields = register.fields;
    let result = 'typedef struct packed {\n';
    const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0]);
    // let resCount = sortedFields.length - 1
    let resCount = -1;
    let lastBit = 32; //sortedFields[0][1].bitRange[0]
    sortedFields.forEach(([name, field], index) => {
        const [msb, lsb] = field.bitRange;
        if (lastBit > msb + 1) {
            resCount++;
        }
        lastBit = lsb;
    });
    lastBit = 32; //sortedFields[0][1].bitRange[0]
    sortedFields.forEach(([name, field], index) => {
        const [msb, lsb] = field.bitRange;
        if (lastBit > msb + 1) {
            result += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`;
        }
        if (msb === lsb) {
            result += `  logic ${name};\n`;
        }
        else {
            result += `  logic [${msb - lsb}: 0] ${name};\n`;
        }
        lastBit = lsb;
    });
    if (lastBit > 0) {
        result += `  logic [${lastBit}:0] res_${resCount--};\n`;
    }
    result += `} ${registerName}_t;\n`;
    return result;
}
// 示例调用
const CTRL = {
    type: 'RW',
    description: 'ctrl register',
    fields: {
        ctrl3: { bitRange: [31, 31], reset: BigInt('0x0') },
        ctrl2: { bitRange: [23, 8], reset: BigInt('0x100') },
        ctrl1: { bitRange: [2, 2], reset: BigInt('0x0') },
        ctrl0: { bitRange: [1, 0], reset: BigInt('0x1') }
    }
};
console.log(generateStruct('AIGC_DEMO_ctrl', CTRL));
