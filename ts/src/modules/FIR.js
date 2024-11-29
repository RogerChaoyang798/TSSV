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
exports.FIR = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
var FIR = /** @class */ (function (_super) {
    __extends(FIR, _super);
    function FIR(params) {
        var _this = _super.call(this, {
            // define the default parameter values
            name: params.name,
            coefficients: params.coefficients,
            inWidth: params.inWidth || 8,
            outWidth: params.outWidth || 9,
            rShift: params.rShift || 2
        }) || this;
        // define IO signals
        _this.IOs = {
            clk: { direction: 'input', isClock: 'posedge' },
            rst_b: { direction: 'input', isReset: 'lowasync' },
            en: { direction: 'input' },
            data_in: { direction: 'input', width: _this.params.inWidth || 8, isSigned: true },
            data_out: { direction: 'output', width: _this.params.outWidth || 9, isSigned: true }
        };
        // construct logic
        var nextTapIn = new TSSV_1.default.Sig('data_in');
        var products = [];
        var coeffSum = 0;
        for (var i = 0; i < _this.params.coefficients.length; i++) {
            // construct tap delay line
            var thisTap = _this.addSignal("tap_".concat(i), { width: _this.params.inWidth, isSigned: true });
            _this.addRegister({ d: nextTapIn, clk: 'clk', reset: 'rst_b', en: 'en', q: thisTap });
            // construct tap multipliers
            products.push(_this.addMultiplier({ a: thisTap, b: _this.params.coefficients[i] }));
            coeffSum += Math.abs(Number(_this.params.coefficients[i]));
            nextTapIn = thisTap;
        }
        // construct final vector sum
        var sumWidth = (_this.params.inWidth || 0) + _this.bitWidth(coeffSum);
        var productsExt = products.map(function (p) { return "".concat(sumWidth, "'(").concat(p.toString(), ")"); });
        _this.addSignal('sum', { width: sumWidth, isSigned: true });
        _this.addRegister({
            d: new TSSV_1.default.Expr("".concat(productsExt.join(' + '))),
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'sum'
        });
        // round and saturate to final output
        _this.addSignal('rounded', { width: sumWidth - (_this.params.rShift || 0) + 1, isSigned: true });
        _this.addRound({ in: 'sum', out: 'rounded', rShift: _this.params.rShift || 1 });
        _this.addSignal('saturated', { width: _this.params.outWidth, isSigned: true });
        _this.addSaturate({ in: 'rounded', out: 'saturated' });
        _this.addRegister({
            d: 'saturated',
            clk: 'clk',
            reset: 'rst_b',
            en: 'en',
            q: 'data_out'
        });
        return _this;
    }
    return FIR;
}(TSSV_1.default.Module));
exports.FIR = FIR;
exports.default = FIR;
