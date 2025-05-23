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
exports.ACE5_rtl = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
/**
 * TSSV Interface bundle for the ACE5_rtl protocol
 */
var ACE5_rtl = /** @class */ (function (_super) {
    __extends(ACE5_rtl, _super);
    /**
     * Create a new ACE5_rtl Interface bundle with either master or slave port interface
     * or just a bundle of interconnect wires
     * @param params param value set
     * @param role sets the role of this instance to choose master or slave port interface
     * or just a bundle of interconnect wires
     */
    function ACE5_rtl(params, role) {
        if (params === void 0) { params = {}; }
        if (role === void 0) { role = undefined; }
        var _this = _super.call(this, 'ACE5_rtl', {
            AIW: params.AIW || 8,
            AW: params.AW || 32,
            DIW: params.DIW || 8,
            DW: params.DW || 32
        }, role) || this;
        _this.signals = {
            ACLK: { width: 1 },
            ACLKEN: { width: 1 },
            ACLKENCHK: { width: 1 },
            ARESETn: { width: 1 },
            AWVALID: { width: 1 },
            AWREADY: { width: 1 },
            AWID: { width: params.DIW || 8 },
            AWADDR: { width: params.AW || 32 },
            AWREGION: { width: 4 },
            AWLEN: { width: 8 },
            AWSIZE: { width: 3 },
            AWBURST: { width: 2 },
            AWLOCK: { width: 1 },
            AWCACHE: { width: 4 },
            AWPROT: { width: 3 },
            AWQOS: { width: 4 },
            AWUSER: { width: params.DIW || 8 },
            AWDOMAIN: { width: 2 },
            AWSNOOP: { width: 3 },
            AWUNIQUE: { width: 1 },
            AWTRACE: { width: 1 },
            AWLOOP: { width: params.DIW || 8 },
            AWMMUSECSID: { width: 1 },
            AWMMUSID: { width: params.DIW || 8 },
            AWMMUSSID: { width: params.DIW || 8 },
            AWMMUSSIDV: { width: 1 },
            AWMMUATST: { width: 1 },
            AWNSAID: { width: 4 },
            AWMPAM: { width: 11 },
            AWIDUNQ: { width: 1 },
            AWVALIDCHK: { width: 1 },
            AWREADYCHK: { width: 1 },
            AWIDCHK: { width: params.DIW || 8 },
            AWADDRCHK: { width: params.DIW || 8 },
            AWLENCHK: { width: 1 },
            AWCTLCHK0: { width: 1 },
            AWCTLCHK1: { width: 1 },
            AWCTLCHK2: { width: 1 },
            AWUSERCHK: { width: params.DIW || 8 },
            AWTRACECHK: { width: 1 },
            AWLOOPCHK: { width: 1 },
            AWMMUCHK: { width: 1 },
            AWMMUSIDCHK: { width: params.DIW || 8 },
            AWMMUSSIDCHK: { width: params.DIW || 8 },
            AWNSAIDCHK: { width: 1 },
            AWMPAMCHK: { width: 1 },
            WVALID: { width: 1 },
            WREADY: { width: 1 },
            WDATA: { width: params.DW || 32 },
            WSTRB: { width: params.DIW || 8 },
            WLAST: { width: 1 },
            WUSER: { width: params.DIW || 8 },
            WPOISON: { width: params.DIW || 8 },
            WTRACE: { width: 1 },
            WVALIDCHK: { width: 1 },
            WREADYCHK: { width: 1 },
            WDATACHK: { width: params.DIW || 8 },
            WSTRBCHK: { width: params.DIW || 8 },
            WLASTCHK: { width: 1 },
            WUSERCHK: { width: params.DIW || 8 },
            WPOISONCHK: { width: 1 },
            WTRACECHK: { width: 1 },
            BVALID: { width: 1 },
            BREADY: { width: 1 },
            BID: { width: params.DIW || 8 },
            BIDUNQ: { width: 1 },
            BRESP: { width: 2 },
            BUSER: { width: params.DIW || 8 },
            BTRACE: { width: 1 },
            BLOOP: { width: params.DIW || 8 },
            BVALIDCHK: { width: 1 },
            BREADYCHK: { width: 1 },
            BIDCHK: { width: params.DIW || 8 },
            BRESPCHK: { width: 1 },
            BUSERCHK: { width: params.DIW || 8 },
            BTRACECHK: { width: 1 },
            BLOOPCHK: { width: 1 },
            ARVALID: { width: 1 },
            ARREADY: { width: 1 },
            ARID: { width: params.DIW || 8 },
            ARADDR: { width: params.AW || 32 },
            ARREGION: { width: 4 },
            ARLEN: { width: 8 },
            ARSIZE: { width: 3 },
            ARBURST: { width: 2 },
            ARLOCK: { width: 1 },
            ARCACHE: { width: 4 },
            ARPROT: { width: 3 },
            ARQOS: { width: 4 },
            ARUSER: { width: params.DIW || 8 },
            ARSNOOP: { width: 4 },
            ARDOMAIN: { width: 2 },
            ARVMIDEXT: { width: 4 },
            ARTRACE: { width: 1 },
            ARLOOP: { width: params.DIW || 8 },
            ARMMUSECSID: { width: 1 },
            ARMMUSID: { width: params.DIW || 8 },
            ARMMUSSID: { width: params.DIW || 8 },
            ARMMUSSIDV: { width: 1 },
            ARMMUATST: { width: 1 },
            ARNSAID: { width: 4 },
            ARMPAM: { width: 11 },
            ARIDUNQ: { width: 1 },
            ARVALIDCHK: { width: 1 },
            ARREADYCHK: { width: 1 },
            ARIDCHK: { width: params.DIW || 8 },
            ARADDRCHK: { width: params.DIW || 8 },
            ARLENCHK: { width: 1 },
            ARCTLCHK0: { width: 1 },
            ARCTLCHK1: { width: 1 },
            ARCTLCHK2: { width: 1 },
            ARCTLCHK3: { width: 1 },
            ARUSERCHK: { width: params.DIW || 8 },
            ARTRACECHK: { width: 1 },
            ARLOOPCHK: { width: 1 },
            ARMMUCHK: { width: 1 },
            ARMMUSIDCHK: { width: params.DIW || 8 },
            ARMMUSSIDCHK: { width: params.DIW || 8 },
            ARNSAIDCHK: { width: 1 },
            ARMPAMCHK: { width: 1 },
            RVALID: { width: 1 },
            RREADY: { width: 1 },
            RID: { width: params.DIW || 8 },
            RIDUNQ: { width: 1 },
            RDATA: { width: params.DW || 32 },
            RRESP: { width: 4 },
            RLAST: { width: 1 },
            RUSER: { width: params.DIW || 8 },
            RPOISON: { width: params.DIW || 8 },
            RTRACE: { width: 1 },
            RLOOP: { width: params.DIW || 8 },
            RVALIDCHK: { width: 1 },
            RREADYCHK: { width: 1 },
            RIDCHK: { width: params.DIW || 8 },
            RDATACHK: { width: params.DIW || 8 },
            RRESPCHK: { width: 1 },
            RLASTCHK: { width: 1 },
            RUSERCHK: { width: params.DIW || 8 },
            RPOISONCHK: { width: 1 },
            RTRACECHK: { width: 1 },
            RLOOPCHK: { width: 1 },
            ACVALID: { width: 1 },
            ACREADY: { width: 1 },
            ACADDR: { width: params.AW || 32 },
            ACSNOOP: { width: 4 },
            ACPROT: { width: 3 },
            ACVMIDEXT: { width: 4 },
            ACTRACE: { width: 1 },
            ACVALIDCHK: { width: 1 },
            ACREADYCHK: { width: 1 },
            ACADDRCHK: { width: params.DIW || 8 },
            ACCTLCHK: { width: 1 },
            ACVMIDEXTCHK: { width: 1 },
            ACTRACECHK: { width: 1 },
            CRVALID: { width: 1 },
            CRREADY: { width: 1 },
            CRRESP: { width: 5 },
            CRTRACE: { width: 1 },
            CRNSAID: { width: 4 },
            CRVALIDCHK: { width: 1 },
            CRREADYCHK: { width: 1 },
            CRRESPCHK: { width: 1 },
            CRTRACECHK: { width: 1 },
            CRNSAIDCHK: { width: 1 },
            CDVALID: { width: 1 },
            CDREADY: { width: 1 },
            CDDATA: { width: params.DW || 32 },
            CDLAST: { width: 1 },
            CDPOISON: { width: params.DIW || 8 },
            CDTRACE: { width: 1 },
            CDVALIDCHK: { width: 1 },
            CDREADYCHK: { width: 1 },
            CDDATACHK: { width: params.DIW || 8 },
            CDLASTCHK: { width: 1 },
            CDPOISONCHK: { width: 1 },
            CDTRACECHK: { width: 1 },
            RACK: { width: 1 },
            WACK: { width: 1 },
            RACKCHK: { width: 1 },
            WACKCHK: { width: 1 },
            VAWQOSACCEPT: { width: 4 },
            VARQOSACCEPT: { width: 4 },
            VAWQOSACCEPTCHK: { width: 1 },
            VARQOSACCEPTCHK: { width: 1 },
            AWAKEUP: { width: 1 },
            ACWAKEUP: { width: 1 },
            SYSCOREQ: { width: 1 },
            SYSCOACK: { width: 1 },
            AWAKEUPCHK: { width: 1 },
            ACWAKEUPCHK: { width: 1 },
            SYSCOREQCHK: { width: 1 },
            SYSCOACKCHK: { width: 1 },
            BROADCASTINNER: { width: 1 },
            BROADCASTOUTER: { width: 1 },
            BROADCASTCACHEMAINT: { width: 1 }
        };
        _this.modports = {
            master: {
                ACLK: 'input',
                ACLKEN: 'input',
                ACLKENCHK: 'input',
                ARESETn: 'input',
                AWVALID: 'output',
                AWREADY: 'input',
                AWID: 'output',
                AWADDR: 'output',
                AWREGION: 'output',
                AWLEN: 'output',
                AWSIZE: 'output',
                AWBURST: 'output',
                AWLOCK: 'output',
                AWCACHE: 'output',
                AWPROT: 'output',
                AWQOS: 'output',
                AWUSER: 'output',
                AWDOMAIN: 'output',
                AWSNOOP: 'output',
                AWUNIQUE: 'output',
                AWTRACE: 'output',
                AWLOOP: 'output',
                AWMMUSECSID: 'output',
                AWMMUSID: 'output',
                AWMMUSSID: 'output',
                AWMMUSSIDV: 'output',
                AWMMUATST: 'output',
                AWNSAID: 'output',
                AWMPAM: 'output',
                AWIDUNQ: 'output',
                AWVALIDCHK: 'output',
                AWREADYCHK: 'input',
                AWIDCHK: 'output',
                AWADDRCHK: 'output',
                AWLENCHK: 'output',
                AWCTLCHK0: 'output',
                AWCTLCHK1: 'output',
                AWCTLCHK2: 'output',
                AWUSERCHK: 'output',
                AWTRACECHK: 'output',
                AWLOOPCHK: 'output',
                AWMMUCHK: 'output',
                AWMMUSIDCHK: 'output',
                AWMMUSSIDCHK: 'output',
                AWNSAIDCHK: 'output',
                AWMPAMCHK: 'output',
                WVALID: 'output',
                WREADY: 'input',
                WDATA: 'output',
                WSTRB: 'output',
                WLAST: 'output',
                WUSER: 'output',
                WPOISON: 'output',
                WTRACE: 'output',
                WVALIDCHK: 'output',
                WREADYCHK: 'input',
                WDATACHK: 'output',
                WSTRBCHK: 'output',
                WLASTCHK: 'output',
                WUSERCHK: 'output',
                WPOISONCHK: 'output',
                WTRACECHK: 'output',
                BVALID: 'input',
                BREADY: 'output',
                BID: 'input',
                BIDUNQ: 'input',
                BRESP: 'input',
                BUSER: 'input',
                BTRACE: 'input',
                BLOOP: 'input',
                BVALIDCHK: 'input',
                BREADYCHK: 'output',
                BIDCHK: 'input',
                BRESPCHK: 'input',
                BUSERCHK: 'input',
                BTRACECHK: 'input',
                BLOOPCHK: 'input',
                ARVALID: 'output',
                ARREADY: 'input',
                ARID: 'output',
                ARADDR: 'output',
                ARREGION: 'output',
                ARLEN: 'output',
                ARSIZE: 'output',
                ARBURST: 'output',
                ARLOCK: 'output',
                ARCACHE: 'output',
                ARPROT: 'output',
                ARQOS: 'output',
                ARUSER: 'output',
                ARSNOOP: 'output',
                ARDOMAIN: 'output',
                ARVMIDEXT: 'output',
                ARTRACE: 'output',
                ARLOOP: 'output',
                ARMMUSECSID: 'output',
                ARMMUSID: 'output',
                ARMMUSSID: 'output',
                ARMMUSSIDV: 'output',
                ARMMUATST: 'output',
                ARNSAID: 'output',
                ARMPAM: 'output',
                ARIDUNQ: 'output',
                ARVALIDCHK: 'output',
                ARREADYCHK: 'input',
                ARIDCHK: 'output',
                ARADDRCHK: 'output',
                ARLENCHK: 'output',
                ARCTLCHK0: 'output',
                ARCTLCHK1: 'output',
                ARCTLCHK2: 'output',
                ARCTLCHK3: 'output',
                ARUSERCHK: 'output',
                ARTRACECHK: 'output',
                ARLOOPCHK: 'output',
                ARMMUCHK: 'output',
                ARMMUSIDCHK: 'output',
                ARMMUSSIDCHK: 'output',
                ARNSAIDCHK: 'output',
                ARMPAMCHK: 'output',
                RVALID: 'input',
                RREADY: 'output',
                RID: 'input',
                RIDUNQ: 'input',
                RDATA: 'input',
                RRESP: 'input',
                RLAST: 'input',
                RUSER: 'input',
                RPOISON: 'input',
                RTRACE: 'input',
                RLOOP: 'input',
                RVALIDCHK: 'input',
                RREADYCHK: 'output',
                RIDCHK: 'input',
                RDATACHK: 'input',
                RRESPCHK: 'input',
                RLASTCHK: 'input',
                RUSERCHK: 'input',
                RPOISONCHK: 'input',
                RTRACECHK: 'input',
                RLOOPCHK: 'input',
                ACVALID: 'input',
                ACREADY: 'output',
                ACADDR: 'input',
                ACSNOOP: 'input',
                ACPROT: 'input',
                ACVMIDEXT: 'input',
                ACTRACE: 'input',
                ACVALIDCHK: 'input',
                ACREADYCHK: 'output',
                ACADDRCHK: 'input',
                ACCTLCHK: 'input',
                ACVMIDEXTCHK: 'input',
                ACTRACECHK: 'input',
                CRVALID: 'output',
                CRREADY: 'input',
                CRRESP: 'output',
                CRTRACE: 'output',
                CRNSAID: 'output',
                CRVALIDCHK: 'output',
                CRREADYCHK: 'input',
                CRRESPCHK: 'output',
                CRTRACECHK: 'output',
                CRNSAIDCHK: 'output',
                CDVALID: 'output',
                CDREADY: 'input',
                CDDATA: 'output',
                CDLAST: 'output',
                CDPOISON: 'output',
                CDTRACE: 'output',
                CDVALIDCHK: 'output',
                CDREADYCHK: 'input',
                CDDATACHK: 'output',
                CDLASTCHK: 'output',
                CDPOISONCHK: 'output',
                CDTRACECHK: 'output',
                RACK: 'output',
                WACK: 'output',
                RACKCHK: 'output',
                WACKCHK: 'output',
                VAWQOSACCEPT: 'input',
                VARQOSACCEPT: 'input',
                VAWQOSACCEPTCHK: 'input',
                VARQOSACCEPTCHK: 'input',
                AWAKEUP: 'output',
                ACWAKEUP: 'input',
                SYSCOREQ: 'output',
                SYSCOACK: 'input',
                AWAKEUPCHK: 'output',
                ACWAKEUPCHK: 'input',
                SYSCOREQCHK: 'output',
                SYSCOACKCHK: 'input',
                BROADCASTINNER: 'input',
                BROADCASTOUTER: 'input',
                BROADCASTCACHEMAINT: 'input'
            },
            slave: {
                ACLK: 'input',
                ACLKEN: 'input',
                ACLKENCHK: 'input',
                ARESETn: 'input',
                AWVALID: 'input',
                AWREADY: 'output',
                AWID: 'input',
                AWADDR: 'input',
                AWREGION: 'input',
                AWLEN: 'input',
                AWSIZE: 'input',
                AWBURST: 'input',
                AWLOCK: 'input',
                AWCACHE: 'input',
                AWPROT: 'input',
                AWQOS: 'input',
                AWUSER: 'input',
                AWDOMAIN: 'input',
                AWSNOOP: 'input',
                AWUNIQUE: 'input',
                AWTRACE: 'input',
                AWLOOP: 'input',
                AWMMUSECSID: 'input',
                AWMMUSID: 'input',
                AWMMUSSID: 'input',
                AWMMUSSIDV: 'input',
                AWMMUATST: 'input',
                AWNSAID: 'input',
                AWMPAM: 'input',
                AWIDUNQ: 'input',
                AWVALIDCHK: 'input',
                AWREADYCHK: 'output',
                AWIDCHK: 'input',
                AWADDRCHK: 'input',
                AWLENCHK: 'input',
                AWCTLCHK0: 'input',
                AWCTLCHK1: 'input',
                AWCTLCHK2: 'input',
                AWUSERCHK: 'input',
                AWTRACECHK: 'input',
                AWLOOPCHK: 'input',
                AWMMUCHK: 'input',
                AWMMUSIDCHK: 'input',
                AWMMUSSIDCHK: 'input',
                AWNSAIDCHK: 'input',
                AWMPAMCHK: 'input',
                WVALID: 'input',
                WREADY: 'output',
                WDATA: 'input',
                WSTRB: 'input',
                WLAST: 'input',
                WUSER: 'input',
                WPOISON: 'input',
                WTRACE: 'input',
                WVALIDCHK: 'input',
                WREADYCHK: 'output',
                WDATACHK: 'input',
                WSTRBCHK: 'input',
                WLASTCHK: 'input',
                WUSERCHK: 'input',
                WPOISONCHK: 'input',
                WTRACECHK: 'input',
                BVALID: 'output',
                BREADY: 'input',
                BID: 'output',
                BIDUNQ: 'output',
                BRESP: 'output',
                BUSER: 'output',
                BTRACE: 'output',
                BLOOP: 'output',
                BVALIDCHK: 'output',
                BREADYCHK: 'input',
                BIDCHK: 'output',
                BRESPCHK: 'output',
                BUSERCHK: 'output',
                BTRACECHK: 'output',
                BLOOPCHK: 'output',
                ARVALID: 'input',
                ARREADY: 'output',
                ARID: 'input',
                ARADDR: 'input',
                ARREGION: 'input',
                ARLEN: 'input',
                ARSIZE: 'input',
                ARBURST: 'input',
                ARLOCK: 'input',
                ARCACHE: 'input',
                ARPROT: 'input',
                ARQOS: 'input',
                ARUSER: 'input',
                ARSNOOP: 'input',
                ARDOMAIN: 'input',
                ARVMIDEXT: 'input',
                ARTRACE: 'input',
                ARLOOP: 'input',
                ARMMUSECSID: 'input',
                ARMMUSID: 'input',
                ARMMUSSID: 'input',
                ARMMUSSIDV: 'input',
                ARMMUATST: 'input',
                ARNSAID: 'input',
                ARMPAM: 'input',
                ARIDUNQ: 'input',
                ARVALIDCHK: 'input',
                ARREADYCHK: 'output',
                ARIDCHK: 'input',
                ARADDRCHK: 'input',
                ARLENCHK: 'input',
                ARCTLCHK0: 'input',
                ARCTLCHK1: 'input',
                ARCTLCHK2: 'input',
                ARCTLCHK3: 'input',
                ARUSERCHK: 'input',
                ARTRACECHK: 'input',
                ARLOOPCHK: 'input',
                ARMMUCHK: 'input',
                ARMMUSIDCHK: 'input',
                ARMMUSSIDCHK: 'input',
                ARNSAIDCHK: 'input',
                ARMPAMCHK: 'input',
                RVALID: 'output',
                RREADY: 'input',
                RID: 'output',
                RIDUNQ: 'output',
                RDATA: 'output',
                RRESP: 'output',
                RLAST: 'output',
                RUSER: 'output',
                RPOISON: 'output',
                RTRACE: 'output',
                RLOOP: 'output',
                RVALIDCHK: 'output',
                RREADYCHK: 'input',
                RIDCHK: 'output',
                RDATACHK: 'output',
                RRESPCHK: 'output',
                RLASTCHK: 'output',
                RUSERCHK: 'output',
                RPOISONCHK: 'output',
                RTRACECHK: 'output',
                RLOOPCHK: 'output',
                ACVALID: 'output',
                ACREADY: 'input',
                ACADDR: 'output',
                ACSNOOP: 'output',
                ACPROT: 'output',
                ACVMIDEXT: 'output',
                ACTRACE: 'output',
                ACVALIDCHK: 'output',
                ACREADYCHK: 'input',
                ACADDRCHK: 'output',
                ACCTLCHK: 'output',
                ACVMIDEXTCHK: 'output',
                ACTRACECHK: 'output',
                CRVALID: 'input',
                CRREADY: 'output',
                CRRESP: 'input',
                CRTRACE: 'input',
                CRNSAID: 'input',
                CRVALIDCHK: 'input',
                CRREADYCHK: 'output',
                CRRESPCHK: 'input',
                CRTRACECHK: 'input',
                CRNSAIDCHK: 'input',
                CDVALID: 'input',
                CDREADY: 'output',
                CDDATA: 'input',
                CDLAST: 'input',
                CDPOISON: 'input',
                CDTRACE: 'input',
                CDVALIDCHK: 'input',
                CDREADYCHK: 'output',
                CDDATACHK: 'input',
                CDLASTCHK: 'input',
                CDPOISONCHK: 'input',
                CDTRACECHK: 'input',
                RACK: 'input',
                WACK: 'input',
                RACKCHK: 'input',
                WACKCHK: 'input',
                VAWQOSACCEPT: 'output',
                VARQOSACCEPT: 'output',
                VAWQOSACCEPTCHK: 'output',
                VARQOSACCEPTCHK: 'output',
                AWAKEUP: 'input',
                ACWAKEUP: 'output',
                SYSCOREQ: 'input',
                SYSCOACK: 'output',
                AWAKEUPCHK: 'input',
                ACWAKEUPCHK: 'output',
                SYSCOREQCHK: 'input',
                SYSCOACKCHK: 'output'
            }
        };
        return _this;
    }
    /**
     * VLNV Metadata
     */
    ACE5_rtl.VLNV = {
        vendor: 'amba.com',
        library: 'AMBA5',
        name: 'ACE5_rtl',
        version: 'r0p0_0'
    };
    return ACE5_rtl;
}(TSSV_1.Interface));
exports.ACE5_rtl = ACE5_rtl;
