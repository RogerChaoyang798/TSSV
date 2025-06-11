import { fileURLToPath } from 'url'
import * as fs from 'fs'
import { type RegWoFdsUnfoldRep, type Field, type Register, padZeroes } from 'tssv/lib/tools/shared'
import { dirname } from 'path'
import * as path from 'path'
import { execSync } from 'child_process'
const __dirname = dirname(fileURLToPath(import.meta.url))
const getCommitId = () => {
  try {
    const tssvDir = __dirname
    return execSync('git rev-parse HEAD', { cwd: tssvDir }).toString().trim()
  } catch (err) {
    console.error('Failed to get Git commit ID:', (err as Error).message)
    return 'unknown_commit'
  }
}
const commitId = getCommitId()
const registersFilePath = process.argv[2]
const outputSvFilePath = process.argv[3]
const outputJsonFilePath = process.argv[4]
const WORD_SIZE = Number(process.argv[5] ?? 32)

if (!registersFilePath || !outputSvFilePath || !outputJsonFilePath) {
  console.error('Please provide the paths for registers JSON file, SV output file, and JSON output file.')
  process.exit(1)
}
const BITS_OF_BYTE = 8
const regs = JSON.parse(fs.readFileSync(registersFilePath, 'utf8')) as Record<string, Register>
const svFile = fs.createWriteStream(outputSvFilePath)
const pkgName = path.basename(outputSvFilePath, path.extname(outputSvFilePath))
svFile.write(`package ${pkgName};

`)
svFile.write('// =============================================================================\n')
svFile.write('// Register bit field definition\n')
svFile.write(`// Commit ID: ${commitId}\n`)
svFile.write('// =============================================================================\n\n')

const regs_wofields = {} as Record<string, Register> as Record<string, RegWoFdsUnfoldRep>

function genPackedCalReset (registerName: string, register: Register): string {
  const fields = register.fields
  let result = 'typedef struct packed {\n'
  const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0])
  let resCount = -1
  let lastBit = WORD_SIZE
  const reserved = [] // 用于存储 reserved 的 [lsb, msb]
  sortedFields.forEach(([name, field], index) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      resCount++
      if (register.reserved === undefined) {
        register.reserved = []
      }
      register.reserved.push([lastBit - 1, msb + 1]) // 存储 reserved 的 [lsb, msb]
    }
    lastBit = lsb
  })

  let reset = ''
  let fieldBinStr = ''
  let resBinStr = ''

  lastBit = WORD_SIZE
  sortedFields.forEach(([name, field], index) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      result += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`
      resBinStr = '0'.repeat(lastBit - msb - 1)
      reset += resBinStr
    }
    fieldBinStr = padZeroes(Number(field.reset).toString(2), msb - lsb + 1)
    reset += fieldBinStr
    if (msb === lsb) {
      result += `  logic ${name};\n`
    } else {
      result += `  logic [${msb - lsb}: 0] ${name};\n`
    }
    lastBit = lsb
  })
  if (lastBit > 0) {
    result += `  logic [${lastBit}:0] res_${resCount--};\n`
    reserved.push([0, lastBit - 1]) // 存储最后的 reserved
  }
  result += `} ${registerName}_t;\n`
  register.reset = `0x${padZeroes(parseInt(reset, 2).toString(16).toUpperCase(), 8)}`
  return result
}

function generateAllStructs (registers: Record<string, Register>): string {
  let result = ''
  for (const [registerName, register] of Object.entries(registers)) {
    result += genPackedCalReset(registerName, register)
    result += '\n'
  }
  Object.keys(registers).forEach(key => {
    let { startAddr, repeat, fields, ...rest } = registers[key]
    const registerStartAddr = parseInt(startAddr, 16)
    const packName = `${key}_t`
    if (repeat && repeat > 1) {
      for (let i = 0; i < repeat; i++) {
        const newRegisterName = `${key}_${i}`
        startAddr = `0x${(registerStartAddr + i * WORD_SIZE / BITS_OF_BYTE).toString(16)}`
        regs_wofields[newRegisterName] = { startAddr, packName, ...rest }
      }
    } else {
      regs_wofields[key] = { startAddr, packName, ...rest }
    }
  })
  return result
}

const structsCode = generateAllStructs(regs)
svFile.write(structsCode, 'utf8', () => {
  console.log(`Packed Written successfully to ${outputSvFilePath}`)
})
svFile.write(`endpackage : ${pkgName}\n`)
svFile.end()

fs.writeFileSync(outputJsonFilePath, JSON.stringify(regs_wofields, null, 2))
console.log('Updated JSON with reset values')
