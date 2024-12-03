import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Module, serialize, deserialize } from 'tssv/lib/core/TSSV'
import * as fs from 'fs'
import * as path from 'path'
import { inspect } from 'util'

interface RegWoFdsUnfoldRep {
  startAddr: string
  type: string
  description: string
  reset: string
}

const regsPath = process.argv[2]
const outputSvFilePath = process.argv[3]

const regs = JSON.parse(fs.readFileSync(regsPath, 'utf8')) as Record<string, RegWoFdsUnfoldRep>

// const regArray: [string, string][] = JSON.parse(rawData)

// const myRegMap = regArray.reduce((acc, [regName, regAddr]) => {
//   const address = regAddr.startsWith('0x') ? '0x' + regAddr.slice(2).padStart(8, '0') : regAddr
//   acc[regName] = BigInt(address)
//   return acc
// }, {} as Record<string, bigint>)
const myRegMap = Object.entries(regs).reduce((acc, [regName, regDetails]) => {
  acc[regName] = BigInt(regDetails.startAddr)
  return acc
}, {} as Record<string, bigint>)

const registers: Record<string, { type: string, reset: bigint, description: string }> = {}

for (const [regName, regData] of Object.entries(regs)) {
  registers[regName] = {
    type: regData.type,
    reset: BigInt(regData.reset),
    description: regData.description
  }
}
const myRegs = {
  wordSize: 32 as 32,
  addrMap: myRegMap,
  registers
}

const testRegBlock = new RegisterBlock<typeof myRegs.addrMap>(
  {
    name: 'AIGC_DEMO_reg',
    busAddressWidth: 12 as unknown as 32
  },
  myRegs,
  {}
)

const tbBody =
`
    logic [15:0] count;

    always @(posedge clk or negedge rst_b) begin
      if (!rst_b) begin
         count <= 'd0;
      end else begin
         count <= count + 1'b1;

         case (count)
            'd0: begin
               regs.PADDR <= 32'h00000000;
               regs.PWDATA <= 32'h12345678;
               regs.PWRITE <= 1;
               regs.PENABLE <= 1;
            end
            'd1: begin
               regs.PWRITE <= 0;
               regs.PWRITE <= 0;
               regs.PENABLE <= 1;
            end
            'd2: begin
               regs.PWRITE <= 0;
               regs.PENABLE <= 0;
            end
            'd3: begin
               regs.PADDR <= 32'h00000008;
               regs.PWDATA <= 32'h87654321;
               regs.PWRITE <= 1;
            end
            'd4: begin
               regs.PWRITE <= 0;
               regs.PENABLE <= 1;
            end
            'd5: begin
               regs.PWRITE <= 0;
               regs.PENABLE <= 0;
            end
            'd6: begin
               regs.PADDR <= 32'h00000020;
               regs.PWDATA <= 32'hAABBCCDD;
               regs.PWRITE <= 1;
            end
            'd7: begin
               regs.PWRITE <= 0;
               regs.PENABLE <= 1;
            end
            'd8: begin
               regs.PWRITE <= 0;
               regs.PENABLE <= 0;
            end
            'd9: begin
               // End of test
               $finish;
            end
            default: ;
         endcase
      end
    end
`
const tb_testRegBlock = new Module(
  { name: 'tb_testRegBlock' },
  {
    clk: { direction: 'input', isClock: 'posedge' },
    rst_b: { direction: 'input', isReset: 'lowasync' }
  },
  {},
  tbBody
)

tb_testRegBlock.addSubmodule(
  'dut',
  testRegBlock,
  {},
  true,
  true
)

try {
  const modifySignalTypes = (content: string): string => {
    const dynamicPattern = new RegExp(
      `^logic\s+\[${myRegs.wordSize - 1}:0\]\s+(reg_[A-Z0-9][A-Za-z0-9_]*)\s*`
    )

    return content
      .split('\n')
      .map(line => {
        const trimmedLine = line.trim()
        const match = trimmedLine.match(dynamicPattern)
        if (match) {
          const signalName = match[1]
          return trimmedLine.replace(dynamicPattern, `${signalName}_t ${signalName};`)
        }

        return trimmedLine
      })
      .join('\n')
  }

  const rawVerilog = testRegBlock.writeSystemVerilog()

  const adjustedVerilog = modifySignalTypes(rawVerilog)

  fs.writeFileSync(outputSvFilePath, adjustedVerilog)
} catch (err) {
  console.error(err)
}
