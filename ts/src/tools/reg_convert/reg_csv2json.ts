import * as fs from 'fs'
import { parseBitRange } from 'tssv/lib/tools/shared' // 引入 parseBitRange 函数

const csvFilePath = process.argv[2]
const regMapFilePath = process.argv[3]
const registersFilePath = process.argv[4]
if (!csvFilePath || !regMapFilePath || !registersFilePath) {
  console.error('Please provide the paths for CSV file, regMap JSON file, and registers JSON file.')
  process.exit(1)
}

const WORD_SIZE = Number(process.argv[5] ?? 32)

async function parseCSV (csvFilePath: string): Promise<string[][]> {
  return await new Promise((resolve, reject) => {
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }
      const rows = data.split('\n').map(row => row.trim().split(','))
      resolve(rows)
    })
  })
}
// async function mergeMultilineDescriptions (csvFilePath: string) {
//   const rows = await parseCSV(csvFilePath)
//   const mergedRows = []
//   let curRow = rows[0]
//   for (let i = 1; i < rows.length; i++) {
//     const [description] = rows[i]
//     if (description) {
//       curRow[5] += description
//     } else {
//       mergedRows.push(curRow)
//       curRow = rows[i]
//     }
//   }
//   mergedRows.push(curRow)
//   return mergedRows
// }

// function parseBitRange (bitRange: string) {
//   if (bitRange.includes(':')) {
//     const parts = bitRange.split(':').map(part => parseInt(part.trim(), 10))
//     return [parts[0], parts[1]]
//   } else {
//     const singleValue = parseInt(bitRange.trim(), 10)
//     return [singleValue, singleValue]
//   }
// }
async function generateRegMapAndRegs () {
  const rows = await parseCSV(csvFilePath)
  const regMapEntries: Array<[string, string]> = []
  const registers: Record<string, any> = {}
  let currentBlockName = ''
  let curBlkOffset = ''
  let curRegName = ''
  let curDescription = ''
  let curFieldDescription = ''
  let curFieldName = ''

  for (let i = 1; i < rows.length; i++) {
    const [blockName, blockOffset, registerName, regOffset, type, repeat, description, field, bitRange, accessType, reset, hdlPath, fieldDescription, weOut, useBuf] = rows[i]
    if (blockName) {
      currentBlockName = blockName
      curBlkOffset = blockOffset
      continue
    }
    if (registerName) {
      const startAddr = parseInt(curBlkOffset, 16) + parseInt(regOffset, 16)
      const startAddrHex = '0x' + startAddr.toString(16)
      regMapEntries.push([registerName, startAddrHex])
      curRegName = registerName
      curDescription = description || ''

      if (!registers[curRegName]) {
        registers[curRegName] = {
          type,
          startAddr: startAddrHex,
          repeat: repeat ? parseInt(repeat) : 1,
          description: description || `Description for ${curRegName}`,
          weOut: weOut === '1' || weOut === 'true' || false,
          useBuf: useBuf === '1' || useBuf === 'true' || false
        }
      }
      continue
    }

    if (field) {
      if (!registers[curRegName].fields) {
        registers[curRegName].fields = {}
      }
      curFieldName = field
      curFieldDescription = fieldDescription || `Description for ${field}`
      registers[curRegName].fields[field] = {
        bitRange: bitRange ? parseBitRange(bitRange) : undefined,
        reset: reset ? BigInt(reset) : undefined,
        fieldDescription: curFieldDescription
      }
    } else if (fieldDescription) {
      // If there's a field description but no field, it's likely a continuation of the previous field description
      curFieldDescription += ' ' + fieldDescription.replace(/\n/g, ' ')
      if (curFieldName && registers[curRegName].fields[curFieldName]) {
        registers[curRegName].fields[curFieldName].fieldDescription = curFieldDescription.trim()
      }
    } else if (description) {
      // If there's a description but no field, it's likely a continuation of the register description
      curDescription += ' ' + description
      registers[curRegName].description = curDescription.trim()
    }
  }
  fs.writeFileSync(regMapFilePath, JSON.stringify(regMapEntries, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2))
  fs.writeFileSync(registersFilePath, JSON.stringify(registers, (_, value) => typeof value === 'bigint' ? value.toString() : value, 2))
}

generateRegMapAndRegs().catch(console.error)
