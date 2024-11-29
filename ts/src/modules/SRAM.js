"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SRAM = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * Static Random Access Memory (SRAM) module
 * supports FPGA inference with generated behavioral model SRAM library
 * ASIC macro library can be swapped in for ASIC synthesis/implemenation
 */
var SRAM = /** @class */ (function (_super) {
    __extends(SRAM, _super);
    function SRAM(params) {
        var _this = _super.call(this, {
            // define the default parameter values
            name: params.name,
            dataWidth: params.dataWidth,
            depth: params.depth,
            ports: params.ports,
            writeEnableMask: params.writeEnableMask || 'none',
            readBehavior: params.readBehavior || 'undefOnWrite',
            macroConfig: params.macroConfig || 'default'
        }) || this;
        // add tmp register 'mem'
        _this.addSignal('mem', { width: _this.params.dataWidth, isArray: _this.params.depth });
        // add variables for the "mask" operation
        var mask_cnt = 0;
        var mask_w = 0;
        if (_this.params.writeEnableMask === 'bit') {
            mask_cnt = _this.params.dataWidth;
            mask_w = 1;
        }
        else if (_this.params.writeEnableMask === 'byte') {
            mask_cnt = _this.params.dataWidth / 8;
            mask_w = 8;
        }
        // define IO signals
        switch (_this.params.ports) {
            //= ================================== 1rw ===========================================
            case '1rw': {
                _this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: _this.params.dataWidth },
                    a_data_out: { direction: 'output', width: _this.params.dataWidth },
                    a_addr: { direction: 'input', width: _this.bitWidth(_this.params.depth - 1n) }
                };
                if (_this.params.writeEnableMask === 'bit') {
                    _this.IOs.a_wmask = { direction: 'input', width: _this.params.dataWidth };
                }
                else if (_this.params.writeEnableMask === 'byte') {
                    if ((_this.params.dataWidth % 8) !== 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    _this.IOs.a_wmask = { direction: 'input', width: _this.params.dataWidth / 8 };
                }
                // Define read_enable and data_out in different modes than undefOnWrite and readBeforeWrite
                var read_enable = 'a_re';
                var rw_conflict_out_MaskNone = ''; // for Mask: none mode
                var rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                var rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                if (_this.params.readBehavior === 'undefOnWrite') {
                    read_enable = 'a_re & ~a_we';
                    rw_conflict_out_MaskNone =
                        "`ifndef SYNTHESIS\n        else if(a_re & a_we ) begin //output is X after reading and writing the same address at the same time\n            a_data_out <= 'hx;\n        end \n        `endif";
                    rw_conflict_out_MaskWidthEqual1 =
                        "else if(a_re & a_we & ~a_wmask) begin\n            a_data_out <= mem[a_addr];\n        end\n        `ifndef SYNTHESIS\n        else if(a_re & a_we & a_wmask) begin //output is X after reading and writing the same address at the same time\n            a_data_out <= 'hx;\n        end\n        `endif";
                    rw_conflict_out_MaskWidthGreater1 =
                        "else if(a_re & a_we & ~a_wmask[i]) begin\n                a_data_out[i*".concat(mask_w, " +: ").concat(mask_w, "] <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            `ifndef SYNTHESIS\n            else if(a_re & a_we & a_wmask[i]) begin //output is X after reading and writing the same address at the same time\n                a_data_out[i*").concat(mask_w, " +: ").concat(mask_w, "] <= 'hx;\n            end \n            `endif");
                }
                // define always block
                var body_1rw = '';
                if (_this.params.writeEnableMask === 'none') {
                    body_1rw =
                        "\n    always_ff @(posedge clk) begin \n        if(a_we) begin\n            mem[a_addr] <= a_data_in;\n        end\n        if(".concat(read_enable, ") begin\n            a_data_out <= mem[a_addr];\n        end\n        ").concat(rw_conflict_out_MaskNone, "\n    end          \n    ");
                }
                else if (mask_cnt === 1) {
                    body_1rw =
                        "\n    always_ff @(posedge clk) begin\n        if(a_we & a_wmask) begin\n            mem[a_addr] <= a_data_in;\n        end \n        if(".concat(read_enable, ") begin\n            a_data_out <= mem[a_addr];\n        end \n        ").concat(rw_conflict_out_MaskWidthEqual1, "\n    end\n    ");
                }
                else {
                    body_1rw =
                        "\n    always_ff @(posedge clk) begin\n        for(integer i=0; i<".concat(mask_cnt, "; i=i+1) begin\n            if(a_we & a_wmask[i]) begin\n                mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "] <= a_data_in[i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n        end\n        for(integer i=0; i<").concat(mask_cnt, "; i=i+1) begin\n            if(").concat(read_enable, " & ~a_wmask[i]) begin\n                a_data_out <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            ").concat(rw_conflict_out_MaskWidthGreater1, "\n        end\n    end\n    ");
                }
                _this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_1rw);
                break;
            }
            //= ================================== 2rw ===========================================
            case '2rw': {
                _this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_we: { direction: 'input' },
                    a_data_in: { direction: 'input', width: _this.params.dataWidth },
                    a_data_out: { direction: 'output', width: _this.params.dataWidth },
                    a_addr: { direction: 'input', width: _this.bitWidth(_this.params.depth - 1n) }, // remove - 1n
                    b_re: { direction: 'input' },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: _this.params.dataWidth },
                    b_data_out: { direction: 'output', width: _this.params.dataWidth },
                    b_addr: { direction: 'input', width: _this.bitWidth(_this.params.depth - 1n) }
                };
                if (_this.params.writeEnableMask === 'bit') {
                    _this.IOs.a_wmask = { direction: 'input', width: _this.params.dataWidth };
                    _this.IOs.b_wmask = { direction: 'input', width: _this.params.dataWidth };
                }
                else if (_this.params.writeEnableMask === 'byte') {
                    if ((_this.params.dataWidth % 8) !== 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    _this.IOs.a_wmask = { direction: 'input', width: _this.params.dataWidth / 8 };
                    _this.IOs.b_wmask = { direction: 'input', width: _this.params.dataWidth / 8 };
                }
                // Define read_enable and data_out in different modes than undefOnWrite and readBeforeWrite
                var a_read_enable = 'a_re';
                var b_read_enable = 'b_re';
                var a_rw_conflict_out_MaskNone = ''; // for Mask: none mode
                var a_rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                var a_rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                var b_rw_conflict_out_MaskNone = ''; // for Mask: none mode
                var b_rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                var b_rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                if (_this.params.readBehavior === 'undefOnWrite') {
                    a_read_enable = 'a_re & ~a_rw_conflict';
                    b_read_enable = 'b_re & ~b_rw_conflict';
                    a_rw_conflict_out_MaskNone =
                        "`ifndef SYNTHESIS\n        else if(a_re & a_rw_conflict) begin //output is X after reading and writing the same address at the same time\n            a_data_out <= 'hx;\n        end\n        `endif";
                    a_rw_conflict_out_MaskWidthEqual1 =
                        "else if(a_re & a_rw_conflict & ~((a_we & a_wmask) | (b_write_at_same_addr & b_wmask))) begin\n            a_data_out <= mem[a_addr];\n        end\n        `ifndef SYNTHESIS\n        else if(a_re & a_rw_conflict & ((a_we & a_wmask) | (b_write_at_same_addr & b_wmask))) begin //output is X after reading and writing the same address at the same time\n            a_data_out <= 'hx;\n        end\n        `endif";
                    a_rw_conflict_out_MaskWidthGreater1 =
                        "else if(a_re & a_rw_conflict & ~((a_we & a_wmask[i]) | (b_write_at_same_addr & b_wmask[i]))) begin\n                a_data_out[i*".concat(mask_w, " +: ").concat(mask_w, "] <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            `ifndef SYNTHESIS\n            else if(a_re & a_rw_conflict & ((a_we & a_wmask[i]) | (b_write_at_same_addr & b_wmask[i]))) begin //output is X after reading and writing the same address at the same time\n                a_data_out[i*").concat(mask_w, " +: ").concat(mask_w, "] <= 'hx;\n            end\n            `endif");
                    b_rw_conflict_out_MaskNone =
                        "`ifndef SYNTHESIS\n        else if(b_re & b_rw_conflict) begin //output is X after reading and writing the same address at the same time\n            b_data_out <= 'hx;\n        end\n        `endif";
                    b_rw_conflict_out_MaskWidthEqual1 =
                        "else if(b_re & b_rw_conflict & ~((b_we & b_wmask) | (a_write_at_same_addr & a_wmask))) begin\n            b_data_out <= mem[a_addr];\n        end\n        `ifndef SYNTHESIS\n        else if(b_re & b_rw_conflict & ((b_we & b_wmask) | (a_write_at_same_addr & a_wmask))) begin //output is X after reading and writing the same address at the same time\n            b_data_out <= 'hx;\n        end\n        `endif";
                    b_rw_conflict_out_MaskWidthGreater1 =
                        "else if(b_re & b_rw_conflict & ~((b_we & b_wmask[i]) | (a_write_at_same_addr & a_wmask[i]))) begin\n                b_data_out[i*".concat(mask_w, " +: ").concat(mask_w, "] <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            `ifndef SYNTHESIS\n            else if(b_re & b_rw_conflict & ((b_we & b_wmask[i]) | (a_write_at_same_addr & a_wmask[i]))) begin //output is X after reading and writing the same address at the same time\n                b_data_out[i*").concat(mask_w, " +: ").concat(mask_w, "] <= 'hx;\n            end\n            `endif");
                }
                // define always block
                var body_2rw_a = '';
                var body_2rw_b = '';
                if (_this.params.writeEnableMask === 'none') {
                    body_2rw_a =
                        "\n    always_ff @ (posedge clk) begin\n        if(a_we & ~b_write_at_same_addr) begin\n          mem[a_addr] <= a_data_in;\n        end\n        `ifndef SYNTHESIS\n        else if(a_we & b_write_at_same_addr) begin //output is X after reading and writing the same address at the same time\n            mem[a_addr] <= 'hx;\n        end\n        `endif\n        if(".concat(a_read_enable, ") begin\n          a_data_out <= mem[a_addr];\n        end\n        ").concat(a_rw_conflict_out_MaskNone, "\n    end\n    ");
                    body_2rw_b =
                        "\n    always_ff @ (posedge clk) begin\n        if(b_we & ~a_write_at_same_addr) begin\n          mem[b_addr] <= b_data_in;\n        end\n        `ifndef SYNTHESIS\n        else if(b_we & a_write_at_same_addr) begin //output is X after reading and writing the same address at the same time\n            mem[b_addr] <= 'hx;\n        end\n        `endif\n        if(".concat(b_read_enable, ") begin\n          b_data_out <= mem[b_addr];\n        end\n        ").concat(b_rw_conflict_out_MaskNone, "\n    end\n    ");
                }
                else if (mask_cnt === 1) {
                    body_2rw_a =
                        "\n    always_ff @(posedge clk) begin\n        if(a_we & a_wmask & ~(b_write_at_same_addr & b_wmask)) begin\n            mem[a_addr] <= a_data_in;\n        end\n        `ifndef SYNTHESIS\n        else if(a_we & a_wmask & (b_write_at_same_addr & b_wmask)) begin //output is X after reading and writing the same address at the same time\n            mem[a_addr] <= 'hx;\n        end\n        `endif\n        if(".concat(a_read_enable, ") begin\n            a_data_out <= mem[a_addr];\n        end\n        ").concat(a_rw_conflict_out_MaskWidthEqual1, "\n    end\n    ");
                    body_2rw_b =
                        "\n    always_ff @(posedge clk) begin\n        if(b_we & b_wmask & ~(a_write_at_same_addr & a_wmask)) begin\n            mem[b_addr] <= b_data_in;\n        end\n        `ifndef SYNTHESIS\n        else if(b_we & b_wmask & (a_write_at_same_addr & a_wmask)) begin //output is X after reading and writing the same address at the same time\n            mem[b_addr] <= 'hx;\n        end\n        `endif\n        if(".concat(b_read_enable, ") begin\n            b_data_out <= mem[b_addr];\n        end\n        ").concat(b_rw_conflict_out_MaskWidthEqual1, "\n    end\n    ");
                }
                else {
                    body_2rw_a =
                        "\n    always_ff @(posedge clk) begin\n        for(integer i=0; i<".concat(mask_cnt, "; i=i+1) begin\n            if(a_we & a_wmask[i] & ~(b_write_at_same_addr & b_wmask[i])) begin\n                mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "] <= a_data_in[i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            `ifndef SYNTHESIS\n            else if(a_we & a_wmask[i] & (b_write_at_same_addr & b_wmask[i])) begin //output is X after reading and writing the same address at the same time\n                mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "] <= 'hx;\n            end\n            `endif\n        end\n        for(integer i=0; i<").concat(mask_cnt, "; i=i+1) begin\n            if(").concat(a_read_enable, ") begin\n                a_data_out <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            ").concat(a_rw_conflict_out_MaskWidthGreater1, "\n        end\n        \n    end\n    ");
                    body_2rw_b =
                        "\n    always_ff @(posedge clk) begin\n        for(integer i=0; i<".concat(mask_cnt, "; i=i+1) begin\n            if(b_we & b_wmask[i] & ~(a_write_at_same_addr & a_wmask[i])) begin\n                mem[b_addr][i*").concat(mask_w, " +: ").concat(mask_w, "] <= b_data_in[i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end \n            `ifndef SYNTHESIS\n            else if(b_we & b_wmask[i] & (a_write_at_same_addr & a_wmask[i])) begin //output is X after reading and writing the same address at the same time\n                mem[b_addr][i*").concat(mask_w, " +: ").concat(mask_w, "] <= 'hx;\n            end\n            `endif\n        end\n        for(integer i=0; i<").concat(mask_cnt, "; i=i+1) begin\n            if(").concat(b_read_enable, ") begin\n                b_data_out <= mem[b_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            ").concat(b_rw_conflict_out_MaskWidthGreater1, "\n        end\n    end\n    ");
                }
                _this.addSignal('addr_a_equal_b', { description: '//1 means a_addr === b_addr' });
                _this.addSignal('b_write_at_same_addr', { description: '//1 means port b write the same address as port a' });
                _this.addSignal('a_write_at_same_addr', { description: '//1 means port a write the same address as port b' });
                _this.addAssign({ in: new TSSV_1.Expr('~(|(a_addr ^ b_addr))'), out: 'addr_a_equal_b' });
                _this.addAssign({ in: new TSSV_1.Expr('b_we & addr_a_equal_b'), out: 'b_write_at_same_addr' });
                _this.addAssign({ in: new TSSV_1.Expr('a_we & addr_a_equal_b'), out: 'a_write_at_same_addr' });
                if (_this.params.readBehavior === 'undefOnWrite') {
                    _this.addSignal('a_rw_conflict', { description: '//1 means that either a or b is writing to the same address, while port a is reading, used to determine read/write conflicts at port a' });
                    _this.addSignal('b_rw_conflict', { description: '//1 means that either a or b is writing to the same address, while port b is reading, used to determine read/write conflicts at port b' });
                    _this.addAssign({ in: new TSSV_1.Expr('a_we | b_write_at_same_addr'), out: 'a_rw_conflict' });
                    _this.addAssign({ in: new TSSV_1.Expr('b_we | a_write_at_same_addr'), out: 'b_rw_conflict' });
                }
                _this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_2rw_a);
                _this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'b_data_out'] }, body_2rw_b);
                break;
            }
            //= ================================== 1r1w ===========================================
            case '1r_1w': {
                _this.IOs = {
                    clk: { direction: 'input', isClock: 'posedge' },
                    a_re: { direction: 'input' },
                    a_data_out: { direction: 'output', width: _this.params.dataWidth },
                    a_addr: { direction: 'input', width: _this.bitWidth(_this.params.depth - 1n) },
                    b_we: { direction: 'input' },
                    b_data_in: { direction: 'input', width: _this.params.dataWidth },
                    b_addr: { direction: 'input', width: _this.bitWidth(_this.params.depth - 1n) }
                };
                if (_this.params.writeEnableMask === 'bit') {
                    _this.IOs.b_wmask = { direction: 'input', width: _this.params.dataWidth };
                }
                else if (_this.params.writeEnableMask === 'byte') {
                    if ((_this.params.dataWidth % 8) !== 0)
                        throw Error('SRAM: dataWidth must be a multiple of 8 for byte mask');
                    _this.IOs.b_wmask = { direction: 'input', width: _this.params.dataWidth / 8 };
                }
                // Define read_enable and data_out in different modes than undefOnWrite and readBeforeWrite
                var read_enable = 'a_re';
                var rw_conflict_out_MaskNone = ''; // for Mask: none mode
                var rw_conflict_out_MaskWidthEqual1 = ''; // for Mask: bit/byte mode while mask width equal to 1
                var rw_conflict_out_MaskWidthGreater1 = ''; // for Mask: bit/byte mode while mask width greater than 1
                if (_this.params.readBehavior === 'undefOnWrite') {
                    read_enable = 'a_re & ~b_write_at_same_addr';
                    rw_conflict_out_MaskNone =
                        "`ifndef SYNTHESIS\n        else if(a_re & b_write_at_same_addr) begin //output is X after reading and writing the same address at the same time\n            a_data_out <= 'hx;\n        end\n        `endif";
                    rw_conflict_out_MaskWidthEqual1 =
                        "else if (a_re & b_write_at_same_addr & ~b_wmask) begin\n            a_data_out <= mem[a_addr];\n        end\n        `ifndef SYNTHESIS\n        else if(a_re & b_write_at_same_addr & b_wmask) begin //output is X after reading and writing the same address at the same time\n            a_data_out <= 'hx;\n        end\n        `endif";
                    rw_conflict_out_MaskWidthGreater1 =
                        "else if (a_re & b_write_at_same_addr & ~b_wmask[i]) begin\n                a_data_out[i*".concat(mask_w, " +: ").concat(mask_w, "] <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            `ifndef SYNTHESIS\n            else if(a_re & b_write_at_same_addr & b_wmask[i]) begin //output is X after reading and writing the same address at the same time\n                a_data_out[i*").concat(mask_w, " +: ").concat(mask_w, "] <= 'hx;\n            end\n            `endif");
                }
                // define always block
                var body_1r_1w = '';
                if (_this.params.writeEnableMask === 'none') {
                    body_1r_1w =
                        "\n    always_ff @ (posedge clk) begin\n        if(b_we) begin\n            mem[b_addr] <= b_data_in;\n        end\n        if(".concat(read_enable, ") begin\n            a_data_out <= mem[a_addr];\n        end\n        ").concat(rw_conflict_out_MaskNone, "\n    end\n    ");
                }
                else if (mask_cnt === 1) {
                    body_1r_1w =
                        "\n    always_ff @(posedge clk) begin\n        if(b_we & b_wmask) begin\n            mem[b_addr] <= b_data_in;\n        end \n        if(".concat(read_enable, ") begin\n            a_data_out <= mem[a_addr];\n        end\n        ").concat(rw_conflict_out_MaskWidthEqual1, "\n    end\n    ");
                }
                else {
                    body_1r_1w =
                        "\n    always_ff @(posedge clk) begin\n        for(integer i=0; i<".concat(mask_cnt, "; i=i+1) begin\n            if(b_we & b_wmask[i]) begin\n                mem[b_addr][i*").concat(mask_w, " +: ").concat(mask_w, "] <= b_data_in[i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n        end\n        for(integer i=0; i<").concat(mask_cnt, "; i=i+1) begin\n            if(").concat(read_enable, ") begin\n                a_data_out <= mem[a_addr][i*").concat(mask_w, " +: ").concat(mask_w, "];\n            end\n            ").concat(rw_conflict_out_MaskWidthGreater1, "\n        end\n    end\n    ");
                }
                if (_this.params.readBehavior === 'undefOnWrite') {
                    _this.addSignal('addr_a_equal_b', { description: '//1 means a_addr === b_addr' });
                    _this.addSignal('b_write_at_same_addr', { description: '//1 means port b write the same address as port a' });
                    _this.addAssign({ in: new TSSV_1.Expr('~(|(a_addr ^ b_addr))'), out: 'addr_a_equal_b' });
                    _this.addAssign({ in: new TSSV_1.Expr('b_we & addr_a_equal_b'), out: 'b_write_at_same_addr' });
                }
                _this.addSequentialAlways({ clk: 'clk', outputs: ['mem', 'a_data_out'] }, body_1r_1w);
                break;
            }
        }
        return _this;
    }
    return SRAM;
}(TSSV_1.Module));
exports.SRAM = SRAM;
exports.default = SRAM;
