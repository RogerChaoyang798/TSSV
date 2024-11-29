import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Module, serialize, deserialize } from 'tssv/lib/core/TSSV'
import * as fs from 'fs'
import * as path from 'path'
import { inspect } from 'util'

const myRegMap = {
  UNIT_ID: BigInt('0x00000000'),
  CTRL: BigInt('0x00000004'),
  CFG0: BigInt('0x0000000C'),
  DEBUG_0: BigInt('0x00000400'),
  DEBUG_1: BigInt('0x00000404'),
  DUMMY_DEBUG: BigInt('0x00000FFC')
} as const

const myRegs = {
  wordSize: 32 as 32,
  addrMap: myRegMap,
  registers: {
    UNIT_ID: {
      type: 'RO',
      reset: BigInt('0x00000001'),
      description: 'ID register'
    },
    CTRL: {
      type: 'RW',
      repeat: 1,
      description: 'ctrl register',
      reset: BigInt('0x00010001')
    },
    CFG0: {
      type: 'WO',
      description: 'config register',
      reset: BigInt('0x00000000')
    },
    DEBUG_0: {
      type: 'RO',
      description: 'bus debug register',
      reset: BigInt('0xFF00FF00')
    },
    DEBUG_1: {
      type: 'RO',
      repeat: 8,
      description: 'submodule 1 debug registers',
      reset: BigInt('0x0')
    },
    DUMMY_DEBUG: {
      type: 'RW',
      description: 'dummy debug',
      isSigned: false,
      reset: BigInt('0x0')
    }
  }
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

  const rawVerilog = tb_testRegBlock.writeSystemVerilog()

  const adjustedVerilog = modifySignalTypes(rawVerilog)

  fs.writeFileSync('sv-examples/reg_convert/tb_intAIGCDEMOreg.sv', adjustedVerilog)
} catch (err) {
  console.error(err)
}
