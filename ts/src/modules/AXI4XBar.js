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
exports.AXI4XBar = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
var util_1 = require("util");
var child_process_1 = require("child_process");
var AXI4_1 = require("tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4");
var fs = require("fs");
var os = require("os");
var path = require("path");
// Function to create a temporary file and write a string to it
function saveStringToTempFile(data) {
    var tempFilePath = path.join(os.tmpdir(), "tempfile-".concat(Date.now(), ".txt"));
    fs.writeFileSync(tempFilePath, data);
    return tempFilePath;
}
var AXI4XBar = /** @class */ (function (_super) {
    __extends(AXI4XBar, _super);
    function AXI4XBar(params) {
        var _this = _super.call(this, params) || this;
        _this.IOs = {
            clock: { direction: 'input', isClock: 'posedge' },
            reset: { direction: 'input', isReset: 'highsync' }
        };
        console.log((0, util_1.inspect)(params, { depth: null, colors: true }));
        var innerParams = __assign(__assign({}, params), { moduleName: "".concat(params.name, "_inner") });
        var jsonFile = saveStringToTempFile(TSSV_1.default.serialize(innerParams, undefined, ''));
        console.log('Generating AXI4XBar component using rocketdock container...');
        (0, child_process_1.exec)("cat ".concat(jsonFile, ";third-party/rocket-chip-component-gen/gen_rocket_component.sh AXI4XBar ").concat(jsonFile, "; rm ").concat(jsonFile), function (error, stdout, stderr) {
            if (error) {
                console.error("exec error: ".concat((0, util_1.inspect)(error, { depth: null, colors: true })));
                return;
            }
            console.error("stderr: ".concat(stderr));
            console.log("stdout: ".concat(stdout));
        });
        var bindings = {
            clock: 'clock',
            reset: 'reset'
        };
        for (var _i = 0, _a = _this.params.masters; _i < _a.length; _i++) {
            var m = _a[_i];
            var thisMaster = _this.addInterface(m.name, new AXI4_1.AXI4({
                DATA_WIDTH: (params.beatBytes << 3),
                ADDR_WIDTH: params.addrBits,
                ID_WIDTH: params.idBits,
                USER_WIDTH: 0,
                QOS: 'withQOS'
            }, 'inward'));
            for (var port in thisMaster.signals) {
                var regex = /^(AW|W|AR|R|B)(.*)$/;
                var match = port.match(regex);
                if (match) {
                    var prefix = match[1].toLowerCase();
                    var base = match[2].toLowerCase();
                    if ((base !== 'valid') && (base !== 'ready')) {
                        prefix += '_bits';
                    }
                    bindings["".concat(m.name, "_").concat(prefix, "_").concat(base)] = "".concat(m.name, ".").concat(port);
                }
            }
        }
        for (var _b = 0, _c = _this.params.slaves; _b < _c.length; _b++) {
            var s = _c[_b];
            var thisSlave = _this.addInterface(s.name, new AXI4_1.AXI4({
                DATA_WIDTH: (params.beatBytes << 3),
                ADDR_WIDTH: params.addrBits,
                ID_WIDTH: params.idBits,
                USER_WIDTH: 0,
                QOS: 'withQOS'
            }, 'outward'));
            for (var port in thisSlave.signals) {
                var regex = /^(AW|W|AR|R|B)(.*)$/;
                var match = port.match(regex);
                if (match) {
                    var prefix = match[1].toLowerCase();
                    var base = match[2].toLowerCase();
                    if ((base !== 'valid') && (base !== 'ready')) {
                        prefix += '_bits';
                    }
                    bindings["".concat(s.name, "_").concat(prefix, "_").concat(base)] = "".concat(s.name, ".").concat(port);
                }
            }
        }
        _this.addSystemVerilogSubmodule('inner', "third-party/rocket-chip-component-gen/componentgen/compile.dest/".concat(innerParams.moduleName, ".sv"), {}, bindings, true);
        return _this;
    }
    return AXI4XBar;
}(TSSV_1.default.Module));
exports.AXI4XBar = AXI4XBar;
