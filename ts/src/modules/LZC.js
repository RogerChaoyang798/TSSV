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
exports.LZC = void 0;
/*
* Using dichotomy to calculate the number of leading zeros for data with arbitrary bit width
*
*/
var TSSV_1 = require("tssv/lib/core/TSSV");
var LZC = /** @class */ (function (_super) {
    __extends(LZC, _super);
    function LZC(params) {
        var _this = _super.call(this, {
            // define the default parameter values
            name: params.name,
            dataWidth: params.dataWidth
        }) || this;
        // calculate counter width based on dataWidth
        var cnt_width = _this.bitWidth(_this.params.dataWidth);
        // ============================================IO define start===========================================
        // define IO signals
        _this.IOs = {
            data_in: { direction: 'input', width: _this.params.dataWidth },
            zero_num: { direction: 'output', width: cnt_width },
            is_zero: { direction: 'output' }
        };
        // width and depth check
        if (_this.params.dataWidth <= 0)
            console.log('Error: dataWidth should be greater than 0');
        // ===========================================IO define end==============================================
        var padding_num = 0;
        var tmp_val_width = _this.params.dataWidth;
        if (Math.log2(_this.params.dataWidth) % 1 !== 0) { // If it is not a power of 2, perform padding processing
            while (Math.log2(tmp_val_width) % 1 !== 0) {
                tmp_val_width++;
                padding_num++;
            }
            _this.addSignal("val".concat(tmp_val_width), { width: tmp_val_width });
            _this.addAssign({ in: new TSSV_1.Expr("{".concat(padding_num, "'d0,data_in}")), out: "val".concat(tmp_val_width) });
            cnt_width++;
        }
        else {
            _this.addSignal("val".concat(tmp_val_width), { width: tmp_val_width });
            _this.addAssign({ in: new TSSV_1.Expr('data_in'), out: "val".concat(tmp_val_width) });
        }
        _this.addSignal('tmp_cnt', { width: cnt_width });
        var cnt_body = '';
        for (var i = cnt_width - 2; i >= 0; i--) {
            if (i >= 0) {
                tmp_val_width = tmp_val_width / 2;
                var tmp_cnt_logic = "tmp_cnt[".concat(i, "] = (val").concat(tmp_val_width * 2, "[").concat(tmp_val_width * 2 - 1, ":").concat(tmp_val_width, "] == ").concat(tmp_val_width, "'d0);");
                _this.addSignal("val".concat(tmp_val_width), { width: tmp_val_width });
                var tmp_val_logic = "val".concat(tmp_val_width, " = tmp_cnt[").concat(i, "] ? val").concat(tmp_val_width * 2, "[").concat(tmp_val_width - 1, ":0] : val").concat(tmp_val_width * 2, "[").concat(tmp_val_width * 2 - 1, ":").concat(tmp_val_width, "];");
                if (i > 0) {
                    cnt_body += "        ".concat(tmp_cnt_logic, "\n        ").concat(tmp_val_logic, "\n");
                }
                else {
                    cnt_body += "        ".concat(tmp_cnt_logic);
                }
            }
        }
        var LatchAlwaysBody = "   begin\n      if(data_in[".concat(_this.params.dataWidth - 1, ":0] == ").concat(_this.params.dataWidth, "'d0) begin\n        is_zero = 1'b1;\n        tmp_cnt = ").concat(cnt_width, "'d").concat(_this.params.dataWidth + padding_num, ";\n      end else begin\n        is_zero = 1'b0;\n        tmp_cnt[").concat(cnt_width - 1, "] = 1'b0;\n").concat(cnt_body, "\n      end\n    end\n");
        _this.addLatchAlways({ outputs: ['tmp_cnt', 'is_zero'] }, LatchAlwaysBody);
        if (Math.log2(_this.params.dataWidth) % 1 !== 0) {
            _this.addSignal('tmp_zero_num', { width: cnt_width });
            _this.addAssign({ in: new TSSV_1.Expr("tmp_cnt - ".concat(cnt_width, "'d").concat(padding_num)), out: 'tmp_zero_num' });
            _this.addAssign({ in: new TSSV_1.Expr("tmp_zero_num[".concat(cnt_width - 2, ":0]")), out: 'zero_num' });
        }
        else {
            _this.addAssign({ in: new TSSV_1.Expr('tmp_cnt'), out: 'zero_num' });
        }
        return _this;
    }
    return LZC;
}(TSSV_1.Module));
exports.LZC = LZC;
exports.default = LZC;
