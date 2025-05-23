import { RegisterBlock } from 'tssv/lib/core/Registers'
import { type RegWoFdsUnfoldRep, type RegisterData } from 'tssv/lib/tools/shared'
import * as fs from 'fs'



const WORD_SIZE = Number(process.argv[5] ?? 32)

function parseRegisterData (regsPath: string): Record<string, RegWoFdsUnfoldRep> {
  return JSON.parse(fs.readFileSync(regsPath, 'utf8')) as Record<string, RegWoFdsUnfoldRep>
}

function createRegisterMap (regs: Record<string, RegWoFdsUnfoldRep>): Record<string, bigint> {
  return Object.entries(regs).reduce<Record<string, bigint>>((acc, [regName, regDetails]) => {
    acc[regName] = BigInt(regDetails.startAddr)
    return acc
  }, {})
}

function createRegisters (regs: Record<string, RegWoFdsUnfoldRep>): Record<string, RegisterData> {
  return Object.entries(regs).reduce<Record<string, RegisterData>>((acc, [regName, regData]) => {
    acc[regName] = {
      type: regData.type,
      reset: BigInt(regData.reset),
      description: regData.description
    }
    return acc
  }, {})
}

function trimLines (content: string): string {
  return content
    .split('\n')
    .map(line => line.trim())
    .join('\n')
}

function replaceSignalTypes (content: string, wordSize: number, regs: Record<string, any>): string {
  return content
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim()
      if (!(trimmedLine.includes('reg_wdata') || trimmedLine.includes('*reg_rdata*'))) {
        for (const [key, reg] of Object.entries(regs)) {
          const keyPattern = `reg_${key.toLowerCase()};`
          if (trimmedLine.includes(keyPattern)) {
            return trimmedLine.replace(`logic [${wordSize - 1}:0]`, reg.packName)
          }
        }
      }
      return trimmedLine
    })
    .join('\n')
}
function splitWdataByRes(content: string, wordSize: number, regs: Record<string, RegWoFdsUnfoldRep>): string {
    return content.replace(/reg_(\w+) <= (\w+);/g, (match, key, source) => {
        const regName = key.toUpperCase();
        const regInfo = regs[regName];
        if (!regInfo || !regInfo.reserved) {
            return match; // 保持原样
        }
        let result = '';
        let lastBit = wordSize - 1;
        // 按位区间从高到低排序
        const sortedReserved = regInfo.reserved.sort((a, b) => b[1] - a[1]);
        sortedReserved.forEach(([msb, lsb]) => {
            if (lastBit > msb) {
                result += `  reg_${key}[${lastBit}:${msb + 1}] <= ${source}[${lastBit}:${msb + 1}];\n`;
            }
            result += `  reg_${key}[${msb}:${lsb}] <= '0;\n`;
            lastBit = lsb - 1;
        });
        if (lastBit > 0) {
            result += `  reg_${key}[${lastBit}:0] <= ${source}[${lastBit}:0];\n`;
        } else if (lastBit === 0) {
            result += `  reg_${key}[0] <= ${source}[0];\n`;
        }
        return result.trim();
    });
}
function generateSVerilog(testRegBlock: RegisterBlock<any>, outSvFilePath: string, regs: Record<string, any>): void {
    const rawVerilog = testRegBlock.writeSystemVerilog();
    let adjustedVerilog = replaceSignalTypes(rawVerilog, WORD_SIZE, regs);
    adjustedVerilog = splitWdataByRes(adjustedVerilog, WORD_SIZE, regs);
    const importStatement = `import ${testRegBlock.name}_pkg::*;`;
    adjustedVerilog = `${importStatement}

// =============================================================================
// Register module
// =============================================================================
${adjustedVerilog} : ${testRegBlock.name}
`

  fs.writeFileSync(outSvFilePath, adjustedVerilog)
}

function generateVerilog (testRegBlock: RegisterBlock<any>, outVFilePath: string): void {
  let rawVerilog = testRegBlock.writeVerilog()
  rawVerilog = trimLines(rawVerilog)

  const importStatement = `import ${testRegBlock.name}_pkg::*;`

  rawVerilog = `${importStatement}

// =============================================================================
// Register module
// =============================================================================
${rawVerilog} : ${testRegBlock.name}
`

  fs.writeFileSync(outVFilePath, rawVerilog)
}

function main () {
  const regsPath = process.argv[2]
  const outputSvFilePath = process.argv[3]
const name = outputSvFilePath.split('/').pop()?.replace(/\.sv$/, '') || ''
  const busAddrW = process.argv[4]
  const outVFilePath = outputSvFilePath.replace('.sv', '.v')

  const regs = parseRegisterData(regsPath)
  const myRegMap = createRegisterMap(regs)
  const registers = createRegisters(regs)

  const myRegs = {
    wordSize: WORD_SIZE as unknown as 32,
    addrMap: myRegMap,
    registers
  }

  const testRegBlock = new RegisterBlock<typeof myRegs.addrMap>(
    {
      name: name || '',
      busAddressWidth: busAddrW as unknown as 32
    },
    myRegs,
    {}
  )
  const testRegBlockV = new RegisterBlock<typeof myRegs.addrMap>(
    {
      name: name || '',
      busAddressWidth: busAddrW as unknown as 32
    },
    myRegs,
    {}
  )

  try {
    generateSVerilog(testRegBlock, outputSvFilePath, regs)
    generateVerilog(testRegBlockV, outVFilePath)
    console.log(`SystemVerilog file generated successfully: ${outputSvFilePath}`)
    console.log(`Verilog file generated successfully: ${outVFilePath}`)
  } catch (err) {
    console.error('Error generating Verilog file:', err)
  }
}

main()
