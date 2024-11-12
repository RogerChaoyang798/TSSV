"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var fast_xml_parser_1 = require("fast-xml-parser");
// Function to read and parse XML file
function parseXmlFile(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var xmlData, parser, jsonData;
        return __generator(this, function (_a) {
            xmlData = fs.readFileSync(filePath, 'utf-8');
            parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', removeNSPrefix: true });
            jsonData = parser.parse(xmlData);
            return [2 /*return*/, jsonData];
        });
    });
}
// Mapping function
function mapToAmbaInterface(json) {
    var _a, _b, _c, _d, _e;
    if (!(json === null || json === void 0 ? void 0 : json.abstractionDefinition)) { // (!json || !json.abstractionDefinition)
        return null;
    }
    var abstractionDefinition = json.abstractionDefinition;
    var vlnv = {
        vendor: abstractionDefinition.vendor || '',
        library: abstractionDefinition.library || '',
        name: abstractionDefinition.name || '',
        version: abstractionDefinition.version || ''
    };
    var mapSignal = function (port) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        return ({
            name: port.logicalName.replace(/\./g, '_'),
            width: ((_b = (_a = port.wire) === null || _a === void 0 ? void 0 : _a.onMaster) === null || _b === void 0 ? void 0 : _b.width) || ((_d = (_c = port.wire) === null || _c === void 0 ? void 0 : _c.onSlave) === null || _d === void 0 ? void 0 : _d.width),
            producerDirection: (_f = (_e = port.wire) === null || _e === void 0 ? void 0 : _e.onMaster) === null || _f === void 0 ? void 0 : _f.direction,
            responderDirection: (_h = (_g = port.wire) === null || _g === void 0 ? void 0 : _g.onSlave) === null || _h === void 0 ? void 0 : _h.direction,
            isClock: ((_k = (_j = port.wire) === null || _j === void 0 ? void 0 : _j.qualifier) === null || _k === void 0 ? void 0 : _k.isClock) === true,
            isData: ((_m = (_l = port.wire) === null || _l === void 0 ? void 0 : _l.qualifier) === null || _m === void 0 ? void 0 : _m.isData) === true,
            isAddress: ((_p = (_o = port.wire) === null || _o === void 0 ? void 0 : _o.qualifier) === null || _p === void 0 ? void 0 : _p.isAddress) === true,
            isReset: ((_r = (_q = port.wire) === null || _q === void 0 ? void 0 : _q.qualifier) === null || _r === void 0 ? void 0 : _r.isReset) === true,
            isClockEnable: ((_t = (_s = port.wire) === null || _s === void 0 ? void 0 : _s.qualifier) === null || _t === void 0 ? void 0 : _t.isClockEnable) === true
        });
    };
    var signals = (_a = abstractionDefinition.ports) === null || _a === void 0 ? void 0 : _a.port.map(mapSignal);
    return {
        name: abstractionDefinition.name || '',
        vlnv: vlnv,
        busInterfaces: {
            busInterface: {
                name: abstractionDefinition.name || '',
                busType: {
                    vendor: ((_b = abstractionDefinition.busType) === null || _b === void 0 ? void 0 : _b.vendor) || '',
                    library: ((_c = abstractionDefinition.busType) === null || _c === void 0 ? void 0 : _c.library) || '',
                    name: ((_d = abstractionDefinition.busType) === null || _d === void 0 ? void 0 : _d.name) || '',
                    version: ((_e = abstractionDefinition.busType) === null || _e === void 0 ? void 0 : _e.version) || ''
                },
                signals: signals
            }
        }
    };
}
// Function to generate TypeScript code
function generateTypeScript(ambaInterface) {
    var _a;
    var interfaceName = ambaInterface.name.replace(/[-.]/g, '_').replace(/\s+/g, '_');
    var busInterface = Array.isArray(ambaInterface.busInterfaces.busInterface)
        ? ambaInterface.busInterfaces.busInterface[0]
        : ambaInterface.busInterfaces.busInterface;
    var tsCode = "import { type TSSVParameters, type IntRange, Interface } from 'tssv/lib/core/TSSV'\n\n/**\n * Interface defining the parameters of the ".concat(interfaceName, " TSSV Interface bundle\n */\nexport interface ").concat(interfaceName, "_Parameters extends TSSVParameters {\n  /**\n   * Defines the bit width of the source identifier signal\n   */\n  AIW?: IntRange<1, 32>\n  /**\n   * Defines the bit width of the address signal\n   */\n  AW?: IntRange<8, 64>\n  /**\n   * Defines the bit width of the sink identifier signal\n   */\n  DIW?: IntRange<1, 32>\n  /**\n   * Defines the data bus width\n   */\n  DW?: 32 | 64\n}\n\n/**\n * Defines the role of the Interface instance\n * outward is used in module port interfaces that are transaction initiators\n * inward is used in module port interfaces that are transaction responders\n * leave role undefined to create just a bundle of interconnect wires\n */\nexport type ").concat(interfaceName, "_Role = 'outward' | 'inward' | undefined\n\n/**\n * TSSV Interface bundle for the ").concat(interfaceName, " protocol\n */\nexport class ").concat(interfaceName, " extends Interface {\n  declare params: ").concat(interfaceName, "_Parameters\n  /**\n   * VLNV Metadata\n   */\n  static readonly VLNV = {\n    vendor: '").concat(ambaInterface.vlnv.vendor, "',\n    library: '").concat(ambaInterface.vlnv.library, "',\n    name: '").concat(ambaInterface.vlnv.name, "',\n    version: '").concat(ambaInterface.vlnv.version, "'\n  }\n\n  /**\n   * Create a new ").concat(interfaceName, " Interface bundle with either outward or inward port interface\n   * or just a bundle of interconnect wires\n   * @param params param value set\n   * @param role sets the role of this instance to choose outward or inward port interface\n   * or just a bundle of interconnect wires\n   */\n  constructor (params: ").concat(interfaceName, "_Parameters = {}, role: ").concat(interfaceName, "_Role = undefined) {\n    super(\n      '").concat(interfaceName, "',\n      {\n        AIW: params.AIW || 8,\n        AW: params.AW || 32,\n        DIW: params.DIW || 8,\n        DW: params.DW || 32\n      },\n      role\n    )\n    this.signals = {\n");
    var uniqueSignals = new Map();
    (_a = busInterface.signals) === null || _a === void 0 ? void 0 : _a.forEach(function (signal) {
        uniqueSignals.set(signal.name, signal);
    });
    var signalEntries = Array.from(uniqueSignals.entries());
    signalEntries.forEach(function (_a, index) {
        var name = _a[0], signal = _a[1];
        // Determine width based on qualifiers
        var width;
        if (signal.width !== undefined) {
            width = signal.width;
        }
        else if (signal.isClock || signal.isReset || signal.isClockEnable) {
            width = 'params.AIW || 8'; // Default to AIW if AIW is defined, otherwise 8
        }
        else if (signal.isAddress) {
            width = 'params.AW || 32'; // Default to AW if AW is defined, otherwise 32
        }
        else if (signal.isData) {
            width = 'params.DW || 32'; // Default to DW if DW is defined, otherwise 32
        }
        else {
            width = 'params.DIW || 8'; // Default to DIW if DIW is defined, otherwise 8
        }
        tsCode += "      ".concat(name.replace(/\./g, '_'), ": { width: ").concat(width, " }").concat(index < signalEntries.length - 1 ? ',' : '', "\n");
    });
    tsCode += "    }\n    this.modports = {\n      outward: {\n";
    var producerSignals = signalEntries.filter(function (_a) {
        var _ = _a[0], signal = _a[1];
        return signal.producerDirection;
    });
    producerSignals.forEach(function (_a, index) {
        var name = _a[0], signal = _a[1];
        tsCode += "        ".concat(name.replace(/\./g, '_'), ": '").concat(signal.producerDirection === 'in' ? 'input' : 'output', "'").concat(index < producerSignals.length - 1 ? ',' : '', "\n");
    });
    tsCode += "      },\n      inward: {\n";
    var responderSignals = signalEntries.filter(function (_a) {
        var name = _a[0], signal = _a[1];
        return signal.responderDirection;
    });
    responderSignals.forEach(function (_a, index) {
        var name = _a[0], signal = _a[1];
        tsCode += "        ".concat(name.replace(/\./g, '_'), ": '").concat(signal.responderDirection === 'in' ? 'input' : 'output', "'").concat(index < responderSignals.length - 1 ? ',' : '', "\n");
    });
    tsCode += "      }\n    }\n  }\n}\n";
    return tsCode;
}
// Main function to execute the script
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var xmlFilePath, outputFilePath, jsonResult, ambaInterface, tsCode, defaultOutputPath, finalOutputPath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xmlFilePath = process.argv[2];
                    outputFilePath = process.argv[3];
                    if (!xmlFilePath) {
                        console.error('Please provide the path to the XML file.');
                        process.exit(1);
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, parseXmlFile(xmlFilePath)];
                case 2:
                    jsonResult = _a.sent();
                    ambaInterface = mapToAmbaInterface(jsonResult);
                    if (ambaInterface) {
                        tsCode = generateTypeScript(ambaInterface);
                        defaultOutputPath = path.join(path.dirname(xmlFilePath), "".concat(ambaInterface.name.replace(/[-.]/g, '_').replace(/\s+/g, '_'), ".ts"));
                        finalOutputPath = outputFilePath || defaultOutputPath;
                        fs.writeFileSync(finalOutputPath, tsCode, 'utf-8');
                        console.log("TypeScript file generated at: ".concat(finalOutputPath));
                    }
                    else {
                        console.error('Error mapping AMBA interface from parsed JSON.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error parsing XML file:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, 1];
            }
        });
    });
}
void main();
