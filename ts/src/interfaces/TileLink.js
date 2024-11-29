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
exports.TL_C = exports.TL_UH = exports.TL_UL = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
var TL_UL = /** @class */ (function (_super) {
    __extends(TL_UL, _super);
    /**
           * create a new TileLink interface bundle with either producer or inward port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or inward port interface
           * or just a bundle of interconnect wires
           */
    function TL_UL(params, role) {
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'TL_UL', {
            w: params.w || 4,
            a: params.a || 32,
            z: params.z || 2,
            o: params.o || 8,
            i: params.i || 8
        }, role) || this;
        _this.signals =
            {
                // a channel
                a_opcode: { width: 3 },
                a_param: { width: 3 },
                a_size: { width: _this.params.z },
                a_source: { width: _this.params.o },
                a_address: { width: _this.params.a },
                a_mask: { width: _this.params.w },
                a_data: { width: (_this.params.w || 4) * 8 },
                a_corrupt: { width: 1 },
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                // d channel
                d_opcode: { width: 3 },
                d_param: { width: 2 },
                d_size: { width: _this.params.z },
                d_source: { width: _this.params.o },
                d_sink: { width: _this.params.i },
                d_denied: { width: 1 },
                d_data: { width: (_this.params.w || 4) * 8 },
                d_corrupt: { width: 1 },
                d_valid: { width: 1 },
                d_ready: { width: 1 }
            };
        _this.modports = {
            outward: {
                // a channel
                a_opcode: 'output',
                a_param: 'output',
                a_size: 'output',
                a_source: 'output',
                a_address: 'output',
                a_mask: 'output',
                a_data: 'output',
                a_corrupt: 'output',
                a_valid: 'output',
                a_ready: 'input',
                // d channel
                d_opcode: 'input',
                d_param: 'input',
                d_size: 'input',
                d_source: 'input',
                d_sink: 'input',
                d_denied: 'input',
                d_data: 'input',
                d_corrupt: 'input',
                d_valid: 'input',
                d_ready: 'output'
            }
        };
        _this.modports.inward = Object.fromEntries(Object.entries(_this.modports.outward).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, (value === 'input') ? 'output' : 'input'];
        }));
        return _this;
    }
    return TL_UL;
}(TSSV_1.Interface));
exports.TL_UL = TL_UL;
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UH level
 */
var TL_UH = /** @class */ (function (_super) {
    __extends(TL_UH, _super);
    /**
           * create a new TileLink interface bundle with either producer or inward port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or inward port interface
           * or just a bundle of interconnect wires
           */
    function TL_UH(params, role) {
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'TL_UH', {
            w: params.w || 4,
            a: params.a || 32,
            z: params.z || 2,
            o: params.o || 8,
            i: params.i || 8
        }, role) || this;
        _this.signals =
            {
                // a channel
                a_opcode: { width: 3 },
                a_param: { width: 3 },
                a_size: { width: _this.params.z },
                a_source: { width: _this.params.o },
                a_address: { width: _this.params.a },
                a_mask: { width: _this.params.w },
                a_data: { width: (_this.params.w || 4) * 8 },
                a_corrupt: { width: 1 },
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                // d channel
                d_opcode: { width: 3 },
                d_param: { width: 2 },
                d_size: { width: _this.params.z },
                d_source: { width: _this.params.o },
                d_sink: { width: _this.params.i },
                d_denied: { width: 1 },
                d_data: { width: (_this.params.w || 4) * 8 },
                d_corrupt: { width: 1 },
                d_valid: { width: 1 },
                d_ready: { width: 1 }
            };
        _this.modports = {
            outward: {
                // a channel
                a_opcode: 'output',
                a_param: 'output',
                a_size: 'output',
                a_source: 'output',
                a_address: 'output',
                a_mask: 'output',
                a_data: 'output',
                a_corrupt: 'output',
                a_valid: 'output',
                a_ready: 'input',
                // d channel
                d_opcode: 'input',
                d_param: 'input',
                d_size: 'input',
                d_source: 'input',
                d_sink: 'input',
                d_denied: 'input',
                d_data: 'input',
                d_corrupt: 'input',
                d_valid: 'input',
                d_ready: 'output'
            }
        };
        _this.modports.inward = Object.fromEntries(Object.entries(_this.modports.outward).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, (value === 'input') ? 'output' : 'input'];
        }));
        return _this;
    }
    return TL_UH;
}(TSSV_1.Interface));
exports.TL_UH = TL_UH;
/**
 * TSSV Interface bundle for the Tilelink protocol with TL_UL level
 */
var TL_C = /** @class */ (function (_super) {
    __extends(TL_C, _super);
    /**
           * create a new TileLink interface bundle with either producer or inward port interface
           * or just a bundle of interconnect wires
           * @param params param value set
           * @param role sets the role of this instance to choose producer or inward port interface
           * or just a bundle of interconnect wires
           */
    function TL_C(params, role) {
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'TL_UL', {
            w: params.w || 4,
            a: params.a || 32,
            z: params.z || 2,
            o: params.o || 8,
            i: params.i || 8
        }, role) || this;
        _this.signals =
            {
                // a channel
                a_opcode: { width: 3 },
                a_param: { width: 3 },
                a_size: { width: _this.params.z },
                a_source: { width: _this.params.o },
                a_address: { width: _this.params.a },
                a_mask: { width: _this.params.w },
                a_data: { width: (_this.params.w || 4) * 8 },
                a_corrupt: { width: 1 },
                a_valid: { width: 1 },
                a_ready: { width: 1 },
                // d channel
                d_opcode: { width: 3 },
                d_param: { width: 2 },
                d_size: { width: _this.params.z },
                d_source: { width: _this.params.o },
                d_sink: { width: _this.params.i },
                d_denied: { width: 1 },
                d_data: { width: (_this.params.w || 4) * 8 },
                d_corrupt: { width: 1 },
                d_valid: { width: 1 },
                d_ready: { width: 1 },
                // b channel
                b_opcode: { width: 3 },
                b_param: { width: 3 },
                b_size: { width: _this.params.z },
                b_source: { width: _this.params.o },
                b_address: { width: _this.params.a },
                b_mask: { width: _this.params.w },
                b_data: { width: (_this.params.w || 4) * 8 },
                b_corrupt: { width: 1 },
                b_valid: { width: 1 },
                b_ready: { width: 1 },
                // c channel
                c_opcode: { width: 3 },
                c_param: { width: 3 },
                c_size: { width: _this.params.z },
                c_source: { width: _this.params.o },
                c_address: { width: _this.params.a },
                c_data: { width: (_this.params.w || 4) * 8 },
                c_corrupt: { width: 1 },
                c_valid: { width: 1 },
                c_ready: { width: 1 },
                // e channel
                e_sink: { width: _this.params.i },
                e_valid: { width: 1 },
                e_ready: { width: 1 }
            };
        _this.modports = {
            outward: {
                // a channel
                a_opcode: 'output',
                a_param: 'output',
                a_size: 'output',
                a_source: 'output',
                a_address: 'output',
                a_mask: 'output',
                a_data: 'output',
                a_corrupt: 'output',
                a_valid: 'output',
                a_ready: 'input',
                // d channel
                d_opcode: 'input',
                d_param: 'input',
                d_size: 'input',
                d_source: 'input',
                d_sink: 'input',
                d_denied: 'input',
                d_data: 'input',
                d_corrupt: 'input',
                d_valid: 'input',
                d_ready: 'output',
                // b channel
                b_opcode: 'output',
                b_param: 'output',
                b_size: 'output',
                b_source: 'output',
                b_address: 'output',
                b_mask: 'output',
                b_data: 'output',
                b_corrupt: 'output',
                b_valid: 'output',
                b_ready: 'input',
                // c channel
                c_opcode: 'output',
                c_param: 'output',
                c_size: 'output',
                c_source: 'output',
                c_address: 'output',
                c_data: 'output',
                c_corrupt: 'output',
                c_valid: 'output',
                c_ready: 'input',
                // e channel
                e_sink: 'input',
                e_valid: 'input',
                e_ready: 'output'
            }
        };
        _this.modports.inward = Object.fromEntries(Object.entries(_this.modports.outward).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, (value === 'input') ? 'output' : 'input'];
        }));
        return _this;
    }
    return TL_C;
}(TSSV_1.Interface));
exports.TL_C = TL_C;
