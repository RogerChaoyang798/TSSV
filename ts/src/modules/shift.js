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
exports.shift = void 0;
/*
* Module for generating left or right shift of input data
* To the left, fill the low bit with 0, and expand the output data bit width accordingly
* To the right, if it is a signed number, fill the sign bit with the high bit, and if it is an unsigned number, fill the high bit with 0. Truncate the low bit and keep the bit width unchanged
*/
var TSSV_1 = require("tssv/lib/core/TSSV");
var shift = /** @class */ (function (_super) {
    __extends(shift, _super);
    function shift(params) {
        var _this = _super.call(this, {
            // define the default parameter values
            name: params.name,
            dataWidth: params.dataWidth,
            shift_direct: params.shift_direct || 'right',
            shift_val: params.shift_val,
            isSigned: params.isSigned || 'unsigned'
        }) || this;
        // calculate output width
        var output_width = _this.params.dataWidth;
        if (_this.params.shift_direct === 'left') {
            output_width = _this.params.dataWidth + _this.params.shift_val;
        }
        // ============================================IO define start===========================================
        // define IO signals
        _this.IOs = {
            data_in: { direction: 'input', width: _this.params.dataWidth },
            data_out: { direction: 'output', width: output_width }
        };
        // width and depth check
        if (_this.params.dataWidth <= 0)
            console.log('Error: dataWidth should be greater than 0');
        if (_this.params.shift_direct === 'left') {
            _this.addAssign({ in: new TSSV_1.Expr("{data_in,{".concat(_this.params.shift_val, "{1'b0}}}")), out: 'data_out' });
        }
        else {
            if (_this.params.isSigned === 'signed') {
                _this.addAssign({ in: new TSSV_1.Expr("{{".concat(_this.params.shift_val, "{data_in[").concat(_this.params.dataWidth - 1, "]}},data_in[").concat(_this.params.dataWidth - 1, ":").concat(_this.params.shift_val, "]}")), out: 'data_out' });
            }
            else {
                _this.addAssign({ in: new TSSV_1.Expr("{{".concat(_this.params.shift_val, "{1'b0}},data_in[").concat(_this.params.dataWidth - 1, ":").concat(_this.params.shift_val, "]}")), out: 'data_out' });
            }
        }
        return _this;
    }
    return shift;
}(TSSV_1.Module));
exports.shift = shift;
exports.default = shift;
