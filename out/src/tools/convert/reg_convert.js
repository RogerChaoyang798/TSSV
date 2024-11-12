import * as fs from 'fs';
import * as path from 'path';
const csvFilePath = path.join('/home/runzhe.liu/TSSV/sv-examples/reg_convert', 'regConfig.csv');
const regMapFilePath = path.join('/home/runzhe.liu/TSSV/sv-examples/reg_convert', 'regMap.json');
const registersFilePath = path.join('/home/runzhe.liu/TSSV/sv-examples/reg_convert', 'registers.json');
// interface RegMap {
//     [key: string]: bigint;
// }
const WORD_SIZE = 32;
async function parseCSV(csvFilePath) {
    return await new Promise((resolve, reject) => {
        fs.readFile(csvFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            const rows = data.split('\n').map(row => row.trim().split(','));
            resolve(rows);
        });
    });
}
async function generateRegMapAndRegs() {
    const rows = await parseCSV(csvFilePath);
    const regMapEntries = [];
    const registers = {};
    for (let i = 1; i < rows.length; i++) {
        const [registerName, address, field, width, bitRange, type, reset, isSigned, repeat, description] = rows[i];
        const repeatCount = repeat === '' ? 0 : parseInt(repeat, 10);
        for (let j = 0; j <= repeatCount; j++) {
            if (registerName && address && type) {
                let startAddr = parseInt(address.split('~')[0].trim(), 16);
                //startAddr = parseInt(startAddr, 16)
                let registerMemory = registerName;
                if (repeatCount > 0) {
                    registerMemory = `${registerName}_${j}`;
                }
                // regMapEntries.push([registerMemory, startAddr])
                if (!registers[registerMemory]) {
                    registers[registerMemory] = {
                        type,
                        description: description || `Description for ${registerMemory}`
                    };
                }
                if ((type === 'RW' || type === 'RO') && !field) {
                    registers[registerMemory].reset = reset;
                    if (width) {
                        registers[registerMemory].width = parseInt(width);
                        if (repeatCount > 0) {
                            startAddr = startAddr + WORD_SIZE / 8 * j;
                        }
                    }
                }
                else if (!field) {
                    if (width) {
                        registers[registerMemory].size = parseInt(width);
                        if (repeatCount > 0) {
                            startAddr = startAddr + WORD_SIZE / 8 * registers[registerMemory].size * j;
                        }
                    }
                }
                const startAddrHex = '0x' + startAddr.toString(16);
                regMapEntries.push([registerMemory, startAddrHex]);
            }
            if (field) {
                const [regName] = field.split('_');
                if (!registers[regName].fields) {
                    registers[regName].fields = {};
                }
                registers[regName].fields[field] = {
                    bitRange: bitRange ? [parseInt(bitRange.split('~')[0].trim()), parseInt(bitRange.split('~')[1].trim())] : undefined,
                    reset: reset ? BigInt(reset) : undefined
                };
            }
        }
    }
    fs.writeFileSync(regMapFilePath, JSON.stringify(regMapEntries, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
    fs.writeFileSync(registersFilePath, JSON.stringify(registers, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
}
generateRegMapAndRegs().catch(console.error);
