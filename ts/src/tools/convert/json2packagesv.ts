import * as fs from 'fs'

const registersFilePath = process.argv[2]
const outputSvFilePath = process.argv[3]
const outputJsonFilePath = process.argv[4]

if (!registersFilePath || !outputSvFilePath || !outputJsonFilePath) {
  console.error('Please provide the paths for registers JSON file, SV output file, and JSON output file.')
  process.exit(1)
}
const WORD_SIZE = 32

const AIGC_DEMO_regs = JSON.parse(fs.readFileSync(registersFilePath, 'utf8')) as Record<string, Register>
const svFile = fs.createWriteStream(outputSvFilePath)
svFile.write('package AIGC_DEMO_reg_pkg;\n\n')
svFile.write('// =============================================================================\n')
svFile.write('// Register bit field definition\n')
svFile.write('// =============================================================================\n\n')

interface Field {
  bitRange: [number, number]
  reset?: bigint
  fieldDescription: string
}

interface Register {
  type: string
  description: string
  repeat: number
  fields: Record<string, Field>
  reset: string
}

interface RegWoFdsUnfoldRep {
  type: string
  description: string
  // repeat: number
  reset: string
}

const AIGC_DEMO_regs_wofields = {} as Record<string, Register> as Record<string, RegWoFdsUnfoldRep>

function padZeroes (address: string, width: number): string {
  const padLength = width - address.length
  if (padLength <= 0) return address
  return '0'.repeat(padLength) + address
}

function generateStruct (registerName: string, register: Register): string {
  const fields = register.fields
  let result = 'typedef struct packed {\n'
  const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0])
  let resCount = -1
  let lastBit = WORD_SIZE
  sortedFields.forEach(([name, field], index) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      resCount++
    }
    lastBit = lsb
  })
  lastBit = WORD_SIZE
  let reset: string = ''
  let fieldBinStr = ''
  let resBinStr = ''
  sortedFields.forEach(([name, field], index) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      result += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`
      resBinStr = '0'.repeat(lastBit - msb - 1);
      reset += resBinStr
    }
    fieldBinStr = padZeroes(Number(field.reset).toString(2), msb - lsb + 1)
    reset += fieldBinStr;
    if (msb === lsb) {
      result += `  logic ${name};\n`
    } else {
      result += `  logic [${msb - lsb}: 0] ${name};\n`
    }
    lastBit = lsb
  })
  if (lastBit > 0) {
    result += `  logic [${lastBit}:0] res_${resCount--};\n`
  }
  result += `} ${registerName}_t;\n`
  // console.log(reset)
  // console.log(reset.length)
  register.reset = `0x${padZeroes(parseInt(reset, 2).toString(16).toUpperCase(), 8)}`
  return result
}

function generateAllStructs(registers: Record<string, Register>): string {
  let result = ''
  for (const [registerName, register] of Object.entries(registers)) {
    result += generateStruct(registerName, register)
    result += '\n'
  }
  Object.keys(AIGC_DEMO_regs).forEach(key => {
    const { fields, ...rest } = AIGC_DEMO_regs[key];
    AIGC_DEMO_regs_wofields[key] = rest
  })
  return result
}

const structsCode = generateAllStructs(AIGC_DEMO_regs)
svFile.write(structsCode, 'utf8', () => {
  console.log('Packed Written successfully to pkg.sv')
})
svFile.write('endpackage : AIGC_DEMO_reg_pkg\n')
svFile.end()

fs.writeFileSync(outputJsonFilePath, JSON.stringify(AIGC_DEMO_regs_wofields, null, 2))
console.log('Updated JSON with reset values')
