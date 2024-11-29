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
exports.IpXactComponent = void 0;
var TSSV_1 = require("tssv/lib/core/TSSV");
var fast_xml_parser_1 = require("fast-xml-parser");
var amba = require("tssv/lib/tools/index");
var fs = require("fs");
var IpXactComponent = /** @class */ (function (_super) {
    __extends(IpXactComponent, _super);
    function IpXactComponent(params) {
        var _this = _super.call(this, {
            name: params.name,
            xmlDataPath: params.xmlDataPath,
            svFilePath: params.svFilePath
        }) || this;
        var xmlData = fs.readFileSync(params.xmlDataPath, 'utf-8');
        var interfaceData = _this.createDictionary(xmlData);
        var paramData = _this.parseParameters(xmlData);
        _this.addInterfaces(interfaceData, paramData);
        _this.addSystemVerilogSubmoduleWithBindings(interfaceData);
        return _this;
    }
    IpXactComponent.prototype.addSystemVerilogSubmoduleWithBindings = function (componentDataRecord) {
        var _this = this;
        var SVFilePath = this.params.svFilePath;
        var vModuleName = "verilog".concat(this.params.name);
        var bindings = {};
        // Iterate through each component and build the bindings
        for (var _i = 0, _a = Object.entries(componentDataRecord); _i < _a.length; _i++) {
            var _b = _a[_i], interfaceName = _b[0], componentData = _b[1];
            for (var _c = 0, _d = Object.entries(componentData.ports); _c < _d.length; _c++) {
                var _e = _d[_c], logicalPort = _e[0], physicalPort = _e[1];
                bindings[physicalPort] = "".concat(interfaceName, ".").concat(logicalPort);
            }
        }
        // Parse the Verilog file to get the input signals
        var inputSignals = this.extractInputSignalsFromVerilog(SVFilePath);
        var sigNotAdded = true;
        // Add bindings for input signals not listed in componentData
        inputSignals.forEach(function (signal) {
            if (!Object.values(componentDataRecord).some(function (componentData) {
                return Object.values(componentData.ports).includes(signal);
            })) {
                if (sigNotAdded) {
                    sigNotAdded = false;
                    _this.addSignal('unbound', {});
                }
                bindings[signal] = 'unbound'; // Bind to constant value of 0
            }
        });
        return this.addSystemVerilogSubmodule(vModuleName, SVFilePath, {}, bindings, true);
    };
    // Helper method to extract input signals from a Verilog file
    IpXactComponent.prototype.extractInputSignalsFromVerilog = function (filePath) {
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        var inputSignals = [];
        // Regex to match input signals and their names, handling sizes correctly
        var inputSignalRegex = /input\s+(?:\[\d+:\d+\]\s+)?([^\s,;]+)/g;
        var match;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        while ((match = inputSignalRegex.exec(fileContent)) !== null) {
            // Extract the signal name from the regex match
            var signalName = match[1].trim();
            inputSignals.push(signalName);
        }
        return inputSignals;
    };
    // protected createDictionary (xmlData: string): Record<string, ComponentData> {
    //   const parser = new XMLParser({
    //     ignoreAttributes: false,
    //     attributeNamePrefix: '',
    //     textNodeName: 'text'
    //   })
    //   const jsonObj = parser.parse(xmlData)
    //   const components = jsonObj['spirit:component']
    //   const result: Record<string, ComponentData> = {}
    //   const processComponent = (component: any): void => {
    //     const busInterfaces = component['spirit:busInterfaces']['spirit:busInterface']
    //     busInterfaces.forEach((busInterface: any) => {
    //       const interfaceName = busInterface['spirit:name']
    //       const abstractionType = busInterface['spirit:abstractionType']
    //       const version = abstractionType['spirit:version']
    //       const abstractionName = abstractionType['spirit:name'].replace(/_+/g, '_')
    //       const abstractionLibrary = abstractionType['spirit:library']
    //       const busType = busInterface['spirit:busType']
    //       const busName = busType['spirit:name'].replace(/_+$/, '')
    //       const portMaps = busInterface['spirit:portMaps']['spirit:portMap']
    //       const portDictionary: Record<string, string> = {}
    //       portMaps.forEach((portMap: any) => {
    //         const logicalPort = portMap['spirit:logicalPort']['spirit:name']
    //         const physicalPort = portMap['spirit:physicalPort']['spirit:name']
    //         portDictionary[logicalPort] = physicalPort
    //       })
    //       result[interfaceName] = {
    //         version,
    //         abstractionName,
    //         abstractionLibrary,
    //         busName,
    //         ports: portDictionary
    //       }
    //     })
    //   }
    //   if (Array.isArray(components)) {
    //     components.forEach(processComponent)
    //   } else {
    //     processComponent(components)
    //   }
    //   return result
    // }
    IpXactComponent.prototype.createDictionary = function (xmlData) {
        var parser = new fast_xml_parser_1.XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
            textNodeName: 'text'
        });
        var removePrefix = function (obj) {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(removePrefix);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            return Object.keys(obj).reduce(function (acc, key) {
                var newKey = key.replace(/^[^:]+:/, '');
                acc[newKey] = removePrefix(obj[key]);
                return acc;
            }, {});
        };
        var jsonObj = removePrefix(parser.parse(xmlData));
        var components = jsonObj.component;
        var result = {};
        var processComponent = function (component) {
            var busInterfaces = component.busInterfaces.busInterface;
            busInterfaces.forEach(function (busInterface) {
                var interfaceName = busInterface.name;
                var abstractionType = busInterface.abstractionType;
                var version = abstractionType.version;
                var abstractionName = abstractionType.name.replace(/_+/g, '_');
                var abstractionLibrary = abstractionType.library;
                var busType = busInterface.busType;
                var busName = busType.name.replace(/_+$/, '');
                var portMaps = busInterface.portMaps.portMap;
                var portDictionary = {};
                portMaps.forEach(function (portMap) {
                    var logicalPort = portMap.logicalPort.name;
                    var physicalPort = portMap.physicalPort.name;
                    portDictionary[logicalPort] = physicalPort;
                });
                result[interfaceName] = {
                    version: version,
                    abstractionName: abstractionName,
                    abstractionLibrary: abstractionLibrary,
                    busName: busName,
                    ports: portDictionary
                };
            });
        };
        if (Array.isArray(components)) {
            components.forEach(processComponent);
        }
        else {
            processComponent(components);
        }
        return result;
    };
    IpXactComponent.prototype.addInterfaces = function (interfaceData, parameterData) {
        var _loop_1 = function (interfaceName) {
            var component = interfaceData[interfaceName];
            var pathString = "tssv/lib/interfaces/AMBA/".concat(component.abstractionLibrary, "/").concat(component.busName, "/").concat(component.version, "/").concat(component.busName);
            var InterfaceModule = IpXactComponent.knownInterfaces[pathString];
            if (InterfaceModule) {
                var isAXI = pathString.includes('AXI');
                var isAPB = pathString.includes('APB');
                var isOutward = interfaceName.startsWith('Init');
                var isInward = interfaceName.toLowerCase().startsWith('targ');
                if (isOutward || isInward) {
                    var paramObject_1 = {};
                    if (isAXI) {
                        var axiParams = parameterData[interfaceName];
                        if (axiParams) {
                            for (var _i = 0, _a = Object.entries(axiParams); _i < _a.length; _i++) {
                                var _b = _a[_i], paramName = _b[0], paramData = _b[1];
                                var transformedParamName = transformParameterName(paramName);
                                if (transformedParamName.endsWith('USER_WIDTH')) {
                                    transformedParamName = 'USER_WIDTH';
                                }
                                paramObject_1[transformedParamName] = paramData.value;
                            }
                            // Check if any logical port contains 'QOS' and set the QOS parameter accordingly
                            var qosParameter = component.ports && Object.keys(component.ports).some(function (logicalPort) { return logicalPort.includes('QOS'); }) ? 'withQOS' : 'noQOS';
                            paramObject_1.QOS = qosParameter;
                        }
                    }
                    else if (isAPB) {
                        var apbParams = parameterData[interfaceName];
                        for (var _c = 0, _d = Object.entries(apbParams); _c < _d.length; _c++) {
                            var _e = _d[_c], paramName = _e[0], paramData = _e[1];
                            var transformedName = transformParameterName(paramName);
                            paramObject_1[transformedName] = paramData.value;
                        }
                    }
                    // Remove undefined properties
                    Object.entries(paramObject_1).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        if (value === undefined) {
                            delete paramObject_1[key]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
                        }
                    });
                    // Switched directions
                    var direction = isOutward ? 'inward' : 'outward';
                    // Add interface with parameters
                    this_1.addInterface(interfaceName, new InterfaceModule(paramObject_1, direction)); // eslint-disable-line @typescript-eslint/no-unsafe-argument
                }
                else {
                    console.warn("Interface name ".concat(interfaceName, " does not indicate outward or inward."));
                }
            }
            else {
                console.error("Interface for ".concat(interfaceName, " with path ").concat(pathString, " is not known."));
            }
        };
        var this_1 = this;
        for (var interfaceName in interfaceData) {
            _loop_1(interfaceName);
        }
    };
    // protected addInterfaces (interfaceData: Record<string, ComponentData>, parameterData: Record<string, Record<string, ParameterData>>): void {
    //   for (const interfaceName in interfaceData) {
    //     const component = interfaceData[interfaceName]
    //     const pathString = `tssv/lib/interfaces/AMBA/${component.abstractionLibrary}/${component.busName}/${component.version}/${component.busName}`
    //     const InterfaceModule = IpXactComponent.knownInterfaces[pathString]
    //     if (InterfaceModule) {
    //       const isAXI = pathString.includes('AXI')
    //       const isOutward = interfaceName.startsWith('Init')
    //       const isInward = interfaceName.toLowerCase().startsWith('targ')
    //       if (isOutward || isInward) {
    //         const axiParams = parameterData[interfaceName]
    //         const axiParamObject: Record<string, string | undefined> = {}
    //         if (axiParams) {
    //           for (const [paramName, paramData] of Object.entries(axiParams)) {
    //             let transformedParamName = transformParameterName(paramName)
    //             if (transformedParamName.endsWith('USER_WIDTH')) {
    //               transformedParamName = 'USER_WIDTH'
    //             }
    //             axiParamObject[transformedParamName] = paramData.value
    //           }
    //           // Check if any logical port contains 'QOS' and set the QOS parameter accordingly
    //           const qosParameter = component.ports && Object.keys(component.ports).some(logicalPort => logicalPort.includes('QOS')) ? 'withQOS' : 'noQOS'
    //           axiParamObject.QOS = qosParameter
    //           // Remove undefined properties
    //           Object.entries(axiParamObject).forEach(([key, value]) => {
    //             if (value === undefined) {
    //               // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    //               delete axiParamObject[key]
    //             }
    //           })
    //         }
    //         // Switched directions
    //         const direction = isOutward ? 'inward' : 'outward'
    //         // Add AXI or non-AXI interface with parameters
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //         this.addInterface(interfaceName, new InterfaceModule(isAXI ? axiParamObject : {}, direction))
    //       } else {
    //         console.warn(`Interface name ${interfaceName} does not indicate outward or inward.`)
    //       }
    //     } else {
    //       console.error(`Interface for ${interfaceName} with path ${pathString} is not known.`)
    //     }
    //   }
    // }
    IpXactComponent.prototype.parseParameters = function (xmlInput) {
        var parser = new fast_xml_parser_1.XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_'
        });
        var parsedXml = parser.parse(xmlInput);
        var busInterfaces = parsedXml['spirit:component']['spirit:busInterfaces']['spirit:busInterface'];
        var parametersData = {};
        busInterfaces.forEach(function (interfaceData) {
            var interfaceName = interfaceData['spirit:name'];
            var parameters = interfaceData['spirit:parameters']['spirit:parameter'];
            var interfaceParametersData = {};
            parameters.forEach(function (param) {
                var name = param['spirit:name'];
                var value = param['spirit:value'];
                var realName = transformParameterName("".concat(name));
                interfaceParametersData[name] = {
                    value: value,
                    realName: realName
                };
            });
            parametersData[interfaceName] = interfaceParametersData;
        });
        return parametersData;
    };
    IpXactComponent.knownInterfaces = {
        'tssv/lib/interfaces/AMBA/AMBA2/AHB/r3p0_1/AHB': amba.AHB,
        'tssv/lib/interfaces/AMBA/AMBA3/AHBLite/r2p0_0/AHBLite': amba.AHBLite,
        'tssv/lib/interfaces/AMBA/AMBA3/AHBLiteInitiator/r2p0_0/AHBLiteInitiator': amba.AHBLiteInitiator,
        'tssv/lib/interfaces/AMBA/AMBA3/AHBLiteTarget/r2p0_0/AHBLiteTarget': amba.AHBLiteTarget,
        'tssv/lib/interfaces/AMBA/AMBA3/APB/r2p0_0/APB': amba.APB,
        'tssv/lib/interfaces/AMBA/AMBA3/ATB/r2p0_0/ATB': amba.ATB,
        'tssv/lib/interfaces/AMBA/AMBA3/AXI/r2p0_0/AXI': amba.AXI,
        'tssv/lib/interfaces/AMBA/AMBA3/AXI_RO/r2p0_0/AXI_RO_rtl': amba.AXI_RO_rtl,
        'tssv/lib/interfaces/AMBA/AMBA3/AXI_WO/r2p0_0/AXI_WO_rtl': amba.AXI_WO_rtl,
        'tssv/lib/interfaces/AMBA/AMBA3/LPI/r2p0_0/LPI_rtl': amba.LPI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA3/LPI/r2p1_0/LPI_rtl': amba.LPI_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA3/LPI/r3p0_0/LPI_rtl': amba.LPI_rtl3,
        'tssv/lib/interfaces/AMBA/AMBA4/ACE/r0p0_0/ACE_rtl': amba.ACE_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/ACE-Lite/r0p0_0/ACE-Lite_rtl': amba.ACE_Lite_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/ACE-Lite_RO/r0p0_0/ACE-Lite_RO_rtl': amba.ACE_Lite_RO_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/ACE-Lite_WO/r0p0_0/ACE-Lite_WO_rtl': amba.ACE_Lite_WO_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/ACP/r0p0_0/ACP_rtl': amba.ACP_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/APB4/r0p0_0/APB4_rtl': amba.APB4_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/ATB/r0p0_0/ATB_rtl': amba.ATB_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA4/AXI4/r0p0_0/AXI4': amba.AXI4,
        'tssv/lib/interfaces/AMBA/AMBA4/AXI4-Lite/r0p0_0/AXI4-Lite_rtl': amba.AXI4_Lite_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/AXI4Stream/r0p0_1/AXI4Stream_rtl': amba.AXI4Stream_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/AXI4_RO/r0p0_0/AXI4_RO_rtl': amba.AXI4_RO_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/AXI4_WO/r0p0_0/AXI4_WO_rtl': amba.AXI4_WO_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/P-Channel/r0p0_0/P-Channel_rtl': amba.P_Channel_rtl,
        'tssv/lib/interfaces/AMBA/AMBA4/Q-Channel/r0p0_0/Q-Channel_rtl': amba.Q_Channel_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5/r0p0_0/ACE5_rtl': amba.ACE5_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-Lite/r0p0_0/ACE5-Lite_rtl': amba.ACE5_Lite_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-Lite/r0p2_0/ACE5-Lite_rtl': amba.ACE5_Lite_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteACP/r0p0_0/ACE5-LiteACP_rtl': amba.ACE5_LiteACP_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteACP/r0p2_0/ACE5-LiteACP_rtl': amba.ACE5_LiteACP_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteACP/r0p3_0/ACE5-LiteACP_rtl': amba.ACE5_LiteACP_rtl3,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteDVM/r0p0_0/ACE5-LiteDVM_rtl': amba.ACE5_LiteDVM_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/ACE5-LiteDVM/r0p2_0/ACE5-LiteDVM_rtl': amba.ACE5_LiteDVM_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA5/AHB5Initiator/r0p0_0/AHB5Initiator_rtl': amba.AHB5Initiator_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/AHB5Target/r0p0_0/AHB5Target_rtl': amba.AHB5Target_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/APB5/r0p0_0/APB5_rtl': amba.APB5_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/ATB/r0p0_0/ATB_rtl': amba.ATB_rtl3,
        'tssv/lib/interfaces/AMBA/AMBA5/AXI5/r0p0_0/AXI5_rtl': amba.AXI5_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/AXI5/r0p2_0/AXI5_rtl': amba.AXI5_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA5/AXI5-Lite/r0p0_0/AXI5-Lite_rtl': amba.AXI5_Lite_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/AXI5-Lite/r0p2_0/AXI5-Lite_rtl': amba.AXI5_Lite_rtl2,
        'tssv/lib/interfaces/AMBA/AMBA5/AXI5-Stream/r0p0_0/AXI5-Stream_rtl': amba.AXI5_Stream_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-RND/r0p0_0/CHI-A-RND_rtl': amba.CHI_A_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-RNF/r0p0_0/CHI-A-RNF_rtl': amba.CHI_A_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-RNI/r0p0_0/CHI-A-RNI_rtl': amba.CHI_A_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-SNF/r0p0_0/CHI-A-SNF_rtl': amba.CHI_A_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-A-SNI/r0p0_0/CHI-A-SNI_rtl': amba.CHI_A_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-RND/r0p0_0/CHI-B-RND_rtl': amba.CHI_B_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-RNF/r0p0_0/CHI-B-RNF_rtl': amba.CHI_B_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-RNI/r0p0_0/CHI-B-RNI_rtl': amba.CHI_B_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-SNF/r0p0_0/CHI-B-SNF_rtl': amba.CHI_B_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-B-SNI/r0p0_0/CHI-B-SNI_rtl': amba.CHI_B_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-RND/r0p0_0/CHI-C-RND_rtl': amba.CHI_C_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-RNF/r0p0_0/CHI-C-RNF_rtl': amba.CHI_C_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-RNI/r0p0_0/CHI-C-RNI_rtl': amba.CHI_C_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-SNF/r0p0_0/CHI-C-SNF_rtl': amba.CHI_C_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-C-SNI/r0p0_0/CHI-C-SNI_rtl': amba.CHI_C_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-RND/r0p0_0/CHI-D-RND_rtl': amba.CHI_D_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-RNF/r0p0_0/CHI-D-RNF_rtl': amba.CHI_D_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-RNI/r0p0_0/CHI-D-RNI_rtl': amba.CHI_D_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-SNF/r0p0_0/CHI-D-SNF_rtl': amba.CHI_D_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-D-SNI/r0p0_0/CHI-D-SNI_rtl': amba.CHI_D_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-RND/r0p0_0/CHI-E-RND_rtl': amba.CHI_E_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-RNF/r0p0_0/CHI-E-RNF_rtl': amba.CHI_E_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-RNI/r0p0_0/CHI-E-RNI_rtl': amba.CHI_E_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-SNF/r0p0_0/CHI-E-SNF_rtl': amba.CHI_E_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-E-SNI/r0p0_0/CHI-E-SNI_rtl': amba.CHI_E_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-RND/r0p0_0/CHI-F-RND_rtl': amba.CHI_F_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-RNF/r0p0_0/CHI-F-RNF_rtl': amba.CHI_F_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-RNI/r0p0_0/CHI-F-RNI_rtl': amba.CHI_F_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-SNF/r0p0_0/CHI-F-SNF_rtl': amba.CHI_F_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-F-SNI/r0p0_0/CHI-F-SNI_rtl': amba.CHI_F_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-RND/r0p0_0/CHI-G-RND_rtl': amba.CHI_G_RND_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-RNF/r0p0_0/CHI-G-RNF_rtl': amba.CHI_G_RNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-RNI/r0p0_0/CHI-G-RNI_rtl': amba.CHI_G_RNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-SNF/r0p0_0/CHI-G-SNF_rtl': amba.CHI_G_SNF_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CHI-G-SNI/r0p0_0/CHI-G-SNI_rtl': amba.CHI_G_SNI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/CXS/r0p0_0/CXS_rtl': amba.CXS_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/GFB/r0p0_0/GFB_rtl': amba.GFB_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/LTI/r0p0_0/LTI_rtl': amba.LTI_rtl,
        'tssv/lib/interfaces/AMBA/AMBA5/LTI/r0p1_0/LTI_rtl': amba.LTI_rtl2
    };
    return IpXactComponent;
}(TSSV_1.Module));
exports.IpXactComponent = IpXactComponent;
function transformParameterName(name) {
    var transformedName = name.toUpperCase();
    if (transformedName.startsWith('W')) {
        transformedName = transformedName.slice(1) + '_WIDTH';
    }
    if (transformedName.includes('LEN')) {
        transformedName = transformedName.replace('LEN', 'BURST_LEN');
    }
    return transformedName;
}
exports.default = IpXactComponent;
