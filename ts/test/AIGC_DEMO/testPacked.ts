import * as fs from 'fs'

// const registers = JSON.parse(fs.readFileSync('AIGC_DEMO_reg.json', 'utf8'))

const svFile = fs.createWriteStream('sv-examples/AIGC_DEMO_reg_pkg.sv')
svFile.write('package AIGC_DEMO_reg_pkg;\n\n')
svFile.write('// =============================================================================\n')
svFile.write('// Register bit field definition\n')
svFile.write('// =============================================================================\n\n')

interface Field {
  bitRange: [number, number]
  reset?: bigint
}

interface Register {
  type: string
  description: string
  fields: Record<string, Field>
}

function generateStruct (registerName: string, register: Register): string {
  const fields = register.fields
  let result = 'typedef struct packed {\n'

  const sortedFields = Object.entries(fields).sort((a, b) => b[1].bitRange[0] - a[1].bitRange[0])
  let resCount = -1
  let lastBit = 32

  sortedFields.forEach(([name, field], index) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      resCount++
    }
    lastBit = lsb
  })

  lastBit = 32

  sortedFields.forEach(([name, field], index) => {
    const [msb, lsb] = field.bitRange
    if (lastBit > msb + 1) {
      result += `  logic [${lastBit - msb - 2}:0] res_${resCount--};\n`
    }
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
  return result
}

const CTRL: Register = {
  type: 'RW',
  description: 'ctrl register',
  fields: {
    ctrl3: { bitRange: [31, 31], reset: BigInt('0x0') },
    ctrl2: { bitRange: [23, 8], reset: BigInt('0x100') },
    ctrl1: { bitRange: [2, 2], reset: BigInt('0x0') },
    ctrl0: { bitRange: [1, 0], reset: BigInt('0x1') }
  }
}

// UNIT_ID: {
//   type: 'RO',
//   reset: 1n,
//   description: 'ID register'
// },
// CTRL: {
//   type: 'RW',
//   description: 'ctrl register',
//   fields: {
//     ctrl3: {
//       bitRange: [31, 31],
//       reset: BigInt('0x0')
//     },
//     ctrl2: {
//       bitRange: [23, 8],
//       reset: BigInt('0x100')
//     },
//     ctrl1: {
//       bitRange: [2, 2],
//       reset: BigInt('0x0')
//     },
//     ctrl0: {
//       bitRange: [1, 0],
//       reset: BigInt('0x1')
//     }
//   }
// },
// CFG0: {
//   type: 'WO',
//   description: 'config register',
//   fields: {
//     m2_clear: {
//       bitRange: [24, 24],
//       reset: BigInt('0x0')
//     },
//     m1_clear: {
//       bitRange: [7, 4],
//       reset: BigInt('0x0')
//     },
//     m0_clear: {
//       bitRange: [3, 0],
//       reset: BigInt('0x0')
//     }
//   }
// },
// DEBUG_0: {
//   type: 'RO',
//   description: 'bus debug register',
//   fields: {
//     bus1_prdy: {
//       bitRange: [31, 24],
//       reset: BigInt('0xFF')
//     },
//     bus1_pvld: {
//       bitRange: [23, 16],
//       reset: BigInt('0x0')
//     },
//     bus0_prdy: {
//       bitRange: [15, 8],
//       reset: BigInt('0xFF')
//     },
//     bus0_pvld: {
//       bitRange: [7, 0],
//       reset: BigInt('0x0')
//     }
//   }
// },
// DEBUG_1: {
//   type: 'RO',
//   // repeat: 8,
//   description: 'submodule 1 debug registers',
//   reset: BigInt('0x0')
// },
// DUMMY_DEBUG: {
//   type: 'RW',
//   description: 'dummy debug',
//   reset: BigInt('0x0')
// }

console.log(generateStruct('AIGC_DEMO_ctrl', CTRL))
