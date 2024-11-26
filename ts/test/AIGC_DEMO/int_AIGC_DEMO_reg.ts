import { type RegisterBlockDef, RegisterBlock } from 'tssv/lib/core/Registers'
import { Module, serialize, deserialize } from 'tssv/lib/core/TSSV'
// import { APB } from 'tssv/lib/interfaces/AMBA/AMBA3/APB/r2p0_0/APB'
import { APB4 } from 'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4'
import * as fs from 'fs'
import * as path from 'path'
import { inspect } from 'util'
import diff from 'deep-diff'

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
// console.log(inspect(myRegs, { depth: null, colors: true }))
const serialized = serialize(myRegs)
// console.log(serialized)

const revived = deserialize(serialized)
// console.log(inspect(revived, { depth: null, colors: true }))

const differences = diff.diff(myRegs, revived)
if (!differences) {
  console.log('There are no differences.')
} else {
  console.log(differences)
}

const testRegBlock = new RegisterBlock<typeof myRegs.addrMap>(
  {
    name: 'AIGC_DEMO_reg',
    busAddressWidth: 12 as unknown as 32
  },
  myRegs,
  new APB4()
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
    // 动态生成正则表达式
    const dynamicPattern = new RegExp(
      `^logic\s+\[${myRegs.wordSize - 1}:0\]\s+(reg_[A-Z0-9][A-Za-z0-9_]*)\s*`
    )

    return content
      .split('\n') // 按行分割
      .map(line => {
        // 去除行首缩进
        const trimmedLine = line.trim()

        // 检查是否匹配动态正则表达式
        const match = trimmedLine.match(dynamicPattern)
        if (match) {
          const signalName = match[1] // 提取信号名
          // 替换 logic [31:0] 为信号名_t
          return trimmedLine.replace(dynamicPattern, `${signalName}_t ${signalName};`)
        }

        // 如果不匹配，则直接返回去掉缩进的行
        return trimmedLine
      })
      .join('\n') // 重新组合为字符串
  }

  // 调用 writeSystemVerilog 生成原始内容
  let rawVerilog = tb_testRegBlock.writeSystemVerilog()

  // 对生成的内容处理信号类型和去缩进
  let adjustedVerilog = modifySignalTypes(rawVerilog)

  // 写入文件
  fs.writeFileSync('sv-examples/tb_intAIGCDEMOreg.sv', adjustedVerilog)
} catch (err) {
  console.error(err)
}

// const myRegs = {
//     wordSize: 32,
//     addrMap: myRegMap,
//     registers: {
//         UNIT_ID: {
//             type: 'RO',
// reset: BigInt("0x00000001"),
//             description: 'ID register'
//         },
//         CTRL: {
//             type: 'RW',
//             description: 'ctrl register',
//             reset: BigInt("0x00010001"),
//             fields: {
//                 ctrl3: {
//                     bitRange: [31, 31],
//                     reset: BigInt('0x0')
//                 },
//                 ctrl2: {
//                     bitRange: [23, 8],
//                     reset: BigInt('0x100')
//                 },
//                 ctrl1: {
//                     bitRange: [2, 2],
//                     reset: BigInt('0x0')
//                 },
//                 ctrl0: {
//                     bitRange: [1, 0],
//                     reset: BigInt('0x1')
//                 }
//             }
//         },
//         CFG0: {
//             type: 'WO',
//             description: 'config register',
//              reset: BigInt("0x00000000"),
//             fields: {
//                 m2_clear: {
//                     bitRange: [24, 24],
//                     reset: BigInt('0x0')
//                 },
//                 m1_clear: {
//                     bitRange: [7, 4],
//                     reset: BigInt('0x0')
//                 },
//                 m0_clear: {
//                     bitRange: [3, 0],
//                     reset: BigInt('0x0')
//                 }
//             }
//         },
//         DEBUG_0: {
//             type: 'RO',
//             description: 'bus debug register',
//             reset: BigInt("0xFF00FF00"),
//             fields: {
//                 bus1_prdy: {
//                     bitRange: [31, 24],
//                     reset: BigInt('0xFF')
//                 },
//                 bus1_pvld: {
//                     bitRange: [23, 16],
//                     reset: BigInt('0x0')
//                 },
//                 bus0_prdy: {
//                     bitRange: [15, 8],
//                     reset: BigInt('0xFF')
//                 },
//                 bus0_pvld: {
//                     bitRange: [7, 0],
//                     reset: BigInt('0x0')
//                 }
//             }
//         },
//         DEBUG_1: {
//             type: 'RO',
//             // repeat: 8,
//             description: 'submodule 1 debug registers',
//             reset: BigInt('0x0')
//         },
//         DUMMY_DEBUG: {
//             type: 'RW',
//             description: 'dummy debug',
//             reset: BigInt('0x0')
//         }
//     }
// };
// CTRL: {
//     type: 'RW',
//     description: 'ctrl register',
//     fields: {
//         ctrl3: {
//             bitRange: [31, 31],
//             reset: BigInt('0x0')
//         },
//         ctrl2: {
//             bitRange: [23, 8],
//             reset: BigInt('0x100')
//         },
//         ctrl1: {
//             bitRange: [2, 2],
//             reset: BigInt('0x0')
//         },
//         ctrl0: {
//             bitRange: [1, 0],
//             reset: BigInt('0x1')
//         }
//     }
// }
// CTRL: {
//     type: 'RW',
//     description: 'ctrl register',
//     fields: {
//         ctrl3: {
//             bitRange: [31, 31],
//             reset: BigInt('0x0')
//         },
//         ctrl2: {
//             bitRange: [23, 8],
//             reset: BigInt('0x100')
//         },
//         ctrl1: {
//             bitRange: [2, 2],
//             reset: BigInt('0x0')
//         },
//         ctrl0: {
//             bitRange: [1, 0],
//             reset: BigInt('0x1')
//         }
//     }
// }

// CTRL: {
//     type: 'RW',
//     description: 'ctrl register',
//     fields: {
//         ctrl3: {
//             bitRange: [31, 31],
//             reset: BigInt('0x0')
//         },
//         ctrl2: {
//             bitRange: [23, 8],
//             reset: BigInt('0x100')
//         },
//         ctrl1: {
//             bitRange: [2, 2],
//             reset: BigInt('0x0')
//         },
//         ctrl0: {
//             bitRange: [1, 0],
//             reset: BigInt('0x1')
//         }
//     }
// }
