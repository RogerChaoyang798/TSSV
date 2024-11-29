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
exports.Memory = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
var Memory = /** @class */ (function (_super) {
    __extends(Memory, _super);
    function Memory(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'memory', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ADDR_WIDTH: params.ADDR_WIDTH || 32
        }, role) || this;
        _this.signals =
            {
                ADDR: { width: _this.params.ADDR_WIDTH || 32 },
                DATA_WR: { width: _this.params.DATA_WIDTH || 32 },
                DATA_RD: { width: _this.params.DATA_WIDTH || 32 },
                RE: { width: 1 },
                WE: { width: 1 },
                READY: { width: 1 },
                WSTRB: { width: (_this.params.ADDR_WIDTH || 32) / 8 }
            };
        _this.modports = {
            outward: {
                ADDR: 'input',
                DATA_WR: 'output',
                DATA_RD: 'input',
                WE: 'output',
                RE: 'output',
                READY: 'input',
                WSTRB: 'output'
            },
            inward: {
                ADDR: 'output',
                DATA_WR: 'input',
                DATA_RD: 'output',
                WE: 'input',
                RE: 'input',
                READY: 'output',
                WSTRB: 'input'
            }
        };
        return _this;
    }
    return Memory;
}(TSSV_1.Interface));
exports.Memory = Memory;
