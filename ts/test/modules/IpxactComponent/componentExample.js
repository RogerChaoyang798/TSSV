"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
// import * as fs from 'fs'
var IpXactComponent_1 = require("tssv/lib/modules/IpXactComponent");
var path_1 = require("path");
var url_1 = require("url");
// Convert import.meta.url to __dirname
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
try {
    (0, fs_1.mkdirSync)('sv-examples/IpxactComponent');
}
catch (e) { }
var xml_path = (0, path_1.join)(__dirname, '../../../../ts/test/modules/IpxactComponent/AXI/axiSample.xml');
var sv_path = (0, path_1.join)(__dirname, '../../../../ts/test/modules/IpxactComponent/AXI/architectureSample.sv');
// AXI component
var component = new IpXactComponent_1.IpXactComponent({
    name: 'axiComponent',
    xmlDataPath: xml_path,
    svFilePath: sv_path
});
try {
    var TB = "\n    // verilator lint_off DECLFILENAME\n    // verilator lint_off UNUSED\n    ".concat(component.writeSystemVerilog(), "\n");
    (0, fs_1.writeFileSync)('sv-examples/IpxactComponent/componentExample.sv', TB);
}
catch (err) {
    console.error(err);
}
// APB component
var xml_path_apb = (0, path_1.join)(__dirname, '../../../../ts/test/modules/IpxactComponent/APB/apbSample.xml');
var sv_path_apb = (0, path_1.join)(__dirname, '../../../../ts/test/modules/IpxactComponent/APB/apbArchitecture.sv');
var apbComponent = new IpXactComponent_1.IpXactComponent({
    name: 'apbComponent',
    xmlDataPath: xml_path_apb,
    svFilePath: sv_path_apb
});
try {
    var TB = "\n      // verilator lint_off DECLFILENAME\n      // verilator lint_off UNUSED\n      ".concat(apbComponent.writeSystemVerilog(), "\n  ");
    (0, fs_1.writeFileSync)('sv-examples/IpxactComponent/apbComponentExample.sv', TB);
}
catch (err) {
    console.error(err);
}
