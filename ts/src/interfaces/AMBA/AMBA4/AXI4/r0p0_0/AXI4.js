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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AXI4 = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the AXI4 protocol
 */
var AXI4 = /** @class */ (function (_super) {
    __extends(AXI4, _super);
    /**
     * Create a new AXI4 Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function AXI4(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'AXI4', {
            DATA_WIDTH: params.DATA_WIDTH || 32,
            ADDR_WIDTH: params.ADDR_WIDTH || 32,
            ID_WIDTH: params.ID_WIDTH || 4,
            USER_WIDTH: params.USER_WIDTH || 0,
            QOS: params.QOS || 'withQOS',
            REGION: params.REGION || 'noREGION'
        }, role) || this;
        _this.signals = {
            AWID: { width: params.ID_WIDTH || 4 },
            AWADDR: { width: params.ADDR_WIDTH || 32 },
            AWLEN: { width: 8 },
            AWSIZE: { width: 3 },
            AWBURST: { width: 2 },
            AWLOCK: { width: 1 },
            AWCACHE: { width: 4 },
            AWPROT: { width: 3 },
            AWVALID: { width: 1 },
            AWREADY: { width: 1 },
            WDATA: { width: params.DATA_WIDTH || 32 },
            WSTRB: { width: (params.DATA_WIDTH) ? params.DATA_WIDTH >> 3 : 4 },
            WLAST: { width: 1 },
            WVALID: { width: 1 },
            WREADY: { width: 1 },
            BID: { width: params.ID_WIDTH || 4 },
            BRESP: { width: 2 },
            BVALID: { width: 1 },
            BREADY: { width: 1 },
            ARID: { width: params.ID_WIDTH || 4 },
            ARADDR: { width: params.ADDR_WIDTH || 32 },
            ARLEN: { width: 8 },
            ARSIZE: { width: 3 },
            ARBURST: { width: 2 },
            ARLOCK: { width: 1 },
            ARCACHE: { width: 4 },
            ARPROT: { width: 3 },
            ARVALID: { width: 1 },
            ARREADY: { width: 1 },
            RID: { width: params.ID_WIDTH || 4 },
            RDATA: { width: params.DATA_WIDTH || 32 },
            RRESP: { width: 2 },
            RLAST: { width: 1 },
            RVALID: { width: 1 },
            RREADY: { width: 1 }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            _this.signals.AWUSER = { width: params.USER_WIDTH || 1 };
            _this.signals.WUSER = { width: params.USER_WIDTH || 1 };
            _this.signals.BUSER = { width: params.USER_WIDTH || 1 };
            _this.signals.ARUSER = { width: params.USER_WIDTH || 1 };
            _this.signals.RUSER = { width: params.USER_WIDTH || 1 };
        }
        // Add ARQOS and AWQOS if QOS is true
        if (params.QOS === 'withQOS') {
            _this.signals.ARQOS = { width: 4 };
            _this.signals.AWQOS = { width: 4 };
        }
        if (params.REGION === 'withREGION') {
            _this.signals.ARREGION = { width: 4 };
            _this.signals.AWREGION = { width: 4 };
        }
        _this.modports = {
            outward: {
                AWID: 'output',
                AWADDR: 'output',
                AWLEN: 'output',
                AWSIZE: 'output',
                AWBURST: 'output',
                AWLOCK: 'output',
                AWCACHE: 'output',
                AWPROT: 'output',
                AWQOS: 'output',
                AWVALID: 'output',
                AWREADY: 'input',
                WDATA: 'output',
                WSTRB: 'output',
                WLAST: 'output',
                WVALID: 'output',
                WREADY: 'input',
                BID: 'input',
                BRESP: 'input',
                BVALID: 'input',
                BREADY: 'output',
                ARID: 'output',
                ARADDR: 'output',
                ARLEN: 'output',
                ARSIZE: 'output',
                ARBURST: 'output',
                ARLOCK: 'output',
                ARCACHE: 'output',
                ARPROT: 'output',
                ARQOS: 'output',
                ARVALID: 'output',
                ARREADY: 'input',
                RID: 'input',
                RDATA: 'input',
                RRESP: 'input',
                RLAST: 'input',
                RVALID: 'input',
                RREADY: 'output'
            }
        };
        if ((params.USER_WIDTH || 0) > 0) {
            _this.modports.outward = __assign(__assign({}, _this.modports.outward), { AWUSER: 'output', WUSER: 'output', BUSER: 'input', ARUSER: 'output', RUSER: 'input' });
        }
        // Add modports for QOS signals if QOS is true
        if (params.QOS === 'withQOS') {
            _this.modports.outward = __assign(__assign({}, _this.modports.outward), { ARQOS: 'output', AWQOS: 'output' });
        }
        if (params.REGION === 'withREGION') {
            _this.modports.outward = __assign(__assign({}, _this.modports.outward), { AWREGION: 'output', ARREGION: 'output' });
        }
        _this.modports.inward = Object.fromEntries(Object.entries(_this.modports.outward).map(function (_a) {
            var key = _a[0], value = _a[1];
            return [key, (value === 'input') ? 'output' : 'input'];
        }));
        return _this;
    }
    /**
     * VLNV Metadata
     */
    AXI4.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA4',
        name: 'AXI4',
        version: 'r0p0_0'
    };
    return AXI4;
}(TSSV_1.Interface));
exports.AXI4 = AXI4;
