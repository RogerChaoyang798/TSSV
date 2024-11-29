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
exports.ROM = void 0;
/* 1.Support input files as arrays and files
*  2.The initial data in the file can be binary('b), hexadecimal('h or 0x or 0X), or signed decimal('d or just number), which can contain '_' and spaces, which will be ignored after reading the content
*  3.Arrays can be signed decimal arrays or Uint8Array
*  4.RCF files can be output, just provide the RCF file path when instantiating ROMs, and an RCF with the same name as the ROM will be generated under this path
*  5.Supports endianness('big' or 'little') function, requiring ROM width to be an integer multiple of 8, and initial data bit width to be less than or equal to 8
*  6.Support initial data splitting into two ROMs implementation, simply configure 'split setting' to 'split2two'
*
*  Note the range of signed decimal numbers, the highest bit should be the signed bit
*/
var TSSV_1 = require("tssv/lib/core/TSSV");
var fs = require("fs");
var ROM = /** @class */ (function (_super) {
    __extends(ROM, _super);
    function ROM(params, MemInitFile, rcf_path) {
        var _this = _super.call(this, {
            // define the default parameter values
            name: params.name,
            dataWidth: params.dataWidth,
            endianness: params.endianness || 'big',
            split_setting: params.split_setting || 'interal'
        }) || this;
        _this.rcf_path = rcf_path || '';
        _this.MemInitFile = MemInitFile;
        // Check if the string bit width is greater than the threshold
        var checkBitWidth = function (valueStr, base, bitWidthThreshold) {
            var value;
            switch (base) {
                case 'bin':
                    value = parseInt(valueStr, 2);
                    break;
                case 'dec':
                    value = parseInt(valueStr, 10);
                    break;
                case 'hex':
                    value = parseInt(valueStr, 16);
                    break;
            }
            // Check if the value is valid
            if (isNaN(value)) {
                throw new Error('Invalid value string provided. It cannot be converted to a number.');
            }
            // Calculate the binary bit width of data
            var bitWidth = value === 0 ? 1 : value.toString(2).length;
            // if (bitWidth > bitWidthThreshold) throw Error(`${this.params.name} Initial data ${base}:${valueStr} exceeds the set ROM width ${bitWidthThreshold}`)
            if (base === 'dec') {
                if (bitWidth > bitWidthThreshold)
                    console.log("Error: ".concat(_this.params.name, " Initial data ").concat(base, ":").concat(valueStr, " exceeds the set ROM width ").concat(bitWidthThreshold + 1));
            }
            else {
                if (bitWidth > bitWidthThreshold)
                    console.log("Error: ".concat(_this.params.name, " Initial data ").concat(base, ":").concat(valueStr, " exceeds the set ROM width ").concat(bitWidthThreshold));
            }
        };
        // Extract a string by identifier and convert it to hexadecimal, returning an array in hexadecimal
        function getStringsAfterChars(strings, data_width) {
            // If the input is of type Uint8Array, first convert it to a string array
            var strings_array = [];
            var isUint8Array = strings instanceof Uint8Array;
            if (isUint8Array) {
                strings_array = strings.join(' ').split(' ');
            }
            else {
                strings_array = strings.map(function (num) { return num.toString(); }); // Convert number array to string array
            }
            return strings_array.map(function (str) {
                var result_temp = str;
                var result = '';
                var index_hex = -1;
                for (var _i = 0, _a = ['0x', '0X', '\'h']; _i < _a.length; _i++) {
                    var i = _a[_i];
                    index_hex = result_temp.indexOf(i);
                    if (index_hex !== -1)
                        break;
                }
                var index_dec = result_temp.indexOf('\'d');
                var index_bin = result_temp.indexOf('\'b');
                if (index_hex !== -1) { // Hexadecimal, output directly after truncation
                    result += result_temp.substring(index_hex + '0x'.length);
                }
                else if (index_bin !== -1) { // Binary, truncated and converted to hexadecimal output
                    result_temp = result_temp.substring(index_bin + '\'b'.length);
                    var str2num = parseInt(result_temp, 2); // string to number
                    result += str2num.toString(16).toUpperCase(); // dec to hex
                }
                else if (index_dec !== -1) { // Decimal, truncated to determine positive or negative and convert to hexadecimal output
                    result_temp = result_temp.substring(index_dec + '\'d'.length);
                    checkBitWidth(result_temp, 'dec', data_width - 1); // Check if the signed decimal in the initial file is out of range
                    if (str.startsWith('-')) { // Determine whether the decimal number is negative, if it is negative, take the inverse and add one to its absolute value
                        var abs_dec2bin = (Number(result_temp).toString(2)).padStart(data_width, '0');
                        var bin_inv = abs_dec2bin.split('').map(function (char) { return char === '0' ? '1' : '0'; }).join('');
                        var inv_add1 = (parseInt(bin_inv, 2) + 1).toString(2).padStart(data_width, '0');
                        result += parseInt(inv_add1, 2).toString(16).toUpperCase();
                    }
                    else {
                        result += Number(result_temp).toString(16).toUpperCase();
                    }
                }
                else { // If there is no identifier, default to decimal number
                    if (str.startsWith('-')) { // Determine whether the decimal number is negative, if it is negative, take the inverse and add one to its absolute value
                        result_temp = result_temp.substring(1);
                        if (!isUint8Array) {
                            checkBitWidth(result_temp, 'dec', data_width - 1); // Check if the signed decimal in the normalArray is out of range
                        }
                        var abs_dec2bin = (Number(result_temp).toString(2)).padStart(data_width, '0');
                        var bin_inv = abs_dec2bin.split('').map(function (char) { return char === '0' ? '1' : '0'; }).join('');
                        var inv_add1 = (parseInt(bin_inv, 2) + 1).toString(2).padStart(data_width, '0');
                        result += parseInt(inv_add1, 2).toString(16).toUpperCase();
                    }
                    else {
                        if (!isUint8Array) {
                            checkBitWidth(result_temp, 'dec', data_width - 1); // Check if the signed decimal in the normalArray is out of range
                        }
                        result += Number(result_temp).toString(16).toUpperCase();
                    }
                }
                // initial file Data bit width check
                checkBitWidth(result, 'hex', data_width);
                return result;
            });
        }
        // This function determines whether it is in endian mode based on the initial input data type and the set ROM bit width
        function EndianModeCheck(arrays, data_width) {
            var endian_mode = 0;
            if (Array.isArray(arrays) && arrays.every(function (item) { return typeof item === 'string'; })) { // The input array comes from the initialization file
                var char_index = arrays[0].indexOf('\'b');
                var isBinary = (char_index !== -1); // Check if the data is binary
                if (isBinary) {
                    // Check if the data bit width is 8 and if the ROM bit width is an integer multiple of the data bit width
                    var width_multOf8 = (((arrays[0].substring(char_index + '\'b'.length)).length === 8) && (data_width % 8 === 0) && (data_width / 8 > 1));
                    if (width_multOf8) {
                        endian_mode = 1;
                    }
                }
            }
            else { // The input array comes from the TS array
                if (arrays instanceof Uint8Array) {
                    if ((data_width % 8 === 0) && (data_width / 8 > 1)) {
                        endian_mode = 1;
                    }
                }
            }
            return endian_mode;
        }
        // read init_file
        var init_data_array = [];
        var data_width = _this.params.dataWidth;
        var isEndianMode = 0;
        if (typeof _this.MemInitFile === 'string') {
            var init_data = [];
            try {
                var data = fs.readFileSync("".concat(_this.MemInitFile), 'utf8'); // Read file content to generate a string
                init_data = (data.split('\n')).map(function (item) { return (item.split('_').join('')).split(' ').join(''); }); // Convert the read file content into a string array by line, while removing '_' and spaces from the string
            }
            catch (err) {
                console.error(err);
            }
            isEndianMode = EndianModeCheck(init_data, _this.params.dataWidth);
            if (isEndianMode) {
                data_width = 8;
            }
            init_data_array = getStringsAfterChars(init_data, data_width);
        }
        else {
            isEndianMode = EndianModeCheck(_this.MemInitFile, _this.params.dataWidth);
            if (isEndianMode) {
                data_width = 8;
            }
            init_data_array = getStringsAfterChars(_this.MemInitFile, data_width);
        }
        // calculate rom`s depth
        var rom_depth;
        if (isEndianMode) {
            rom_depth = init_data_array.length / (_this.params.dataWidth / 8);
        }
        else {
            rom_depth = init_data_array.length;
        }
        var rom_addr_width = _this.bitWidth(rom_depth - 1);
        // define IO signals
        _this.IOs = {
            clk: { direction: 'input', isClock: 'posedge' },
            rd_en: { direction: 'input' },
            addr: { direction: 'input', width: rom_addr_width },
            data_out: { direction: 'output', width: _this.params.dataWidth }
        };
        // If the data bit width is uneven, fill the high bits of the data with 0
        var arry_width = Math.ceil(data_width / 4);
        var init_data_array_pad = init_data_array.map(function (array) { return array.padStart(arry_width, '0'); });
        var byte_num = _this.params.dataWidth / 8;
        /*
        // WHY WAS THIS HERE?  IT ROUND THE DEPTH BASED ON THE WIDTH WHICH DOES NOT
        // SEEM TO MAKE SENSE
        while ((init_data_array_pad.length % byte_num) !== 0) {
          init_data_array_pad.push('0'.padStart(arry_width, '0'))
        }
        */
        // construct output signal list
        var signalArray = [];
        if (isEndianMode) {
            var point = 0;
            for (var i = 0; i < rom_depth; i++) {
                var rom_data = '';
                if (_this.params.endianness === 'little') {
                    for (var j = byte_num - 1; j >= 0; j--) {
                        rom_data += init_data_array_pad[point + j];
                    }
                }
                else {
                    for (var j = 0; j < byte_num; j++) {
                        rom_data += init_data_array_pad[point + j];
                    }
                }
                point = point + byte_num;
                if (rom_depth > 1) {
                    signalArray.push("".concat(rom_addr_width, "'d").concat(i, ": data_out <= ").concat(_this.params.dataWidth, "'h").concat(rom_data, ";\n"));
                }
                else { // When depth is 1, the address bit width is also 1
                    signalArray.push("1'd".concat(i, ": data_out <= ").concat(_this.params.dataWidth, "'h").concat(rom_data, ";\n"));
                }
            }
        }
        else {
            for (var n = 0; n < rom_depth; n++) {
                if (rom_depth > 1) {
                    signalArray.push("".concat(rom_addr_width, "'d").concat(n, ": data_out <= ").concat(_this.params.dataWidth, "'h").concat(init_data_array_pad[n], ";\n"));
                }
                else { // When depth is 1, the address bit width is also 1
                    signalArray.push("1'd".concat(n, ": data_out <= ").concat(_this.params.dataWidth, "'h").concat(init_data_array_pad[n], ";\n"));
                }
            }
        }
        // depthSplit setting
        if (_this.params.split_setting === 'split2two') {
            // Convert hexadecimal arrays to signed decimal arrays, as ROM only recognizes input signed decimal arrays
            var init_data_array_dec = init_data_array_pad.map(function (item) {
                var binaryStr = parseInt(item, 16).toString(2).padStart(_this.params.dataWidth, '0'); // Convert to binary string
                var isNegative = binaryStr.charAt(0) === '1'; // Check the first bit
                var decimal_num = parseInt(binaryStr, 2); // Default to positive number
                // If it is a negative number, perform the conversion from complement to original code
                if (isNegative) {
                    var inverted = binaryStr.split('').map(function (bit) { return bit === '0' ? '1' : '0'; }).join(''); // invert
                    var inverted_add1 = (parseInt(inverted, 2) + 1); // Convert to decimal and add one
                    decimal_num = -inverted_add1; // Convert to negative number
                }
                return decimal_num;
            });
            var depth_splitting = 1;
            while (depth_splitting < rom_depth) {
                depth_splitting *= 2;
            }
            if (depth_splitting >= rom_depth) {
                depth_splitting = depth_splitting / 2;
            }
            var addr_l_width = _this.bitWidth(depth_splitting - 1);
            var addr_u_width = _this.bitWidth(rom_depth - depth_splitting - 1);
            _this.addSignal('rd_en_l', { width: 1 });
            _this.addSignal('rd_en_u', { width: 1 });
            _this.addSignal('rd_en_l_d1', { width: 1 });
            _this.addSignal('rd_en_u_d1', { width: 1 });
            _this.addSignal('data_out_l', { width: _this.params.dataWidth });
            _this.addSignal('data_out_u', { width: _this.params.dataWidth });
            _this.addSignal('addr_l', { width: addr_l_width });
            _this.addSignal('addr_u', { width: addr_u_width });
            _this.addAssign({ in: new TSSV_1.Expr("!addr[".concat(rom_addr_width - 1, "] && rd_en")), out: 'rd_en_l' });
            _this.addAssign({ in: new TSSV_1.Expr("addr[".concat(rom_addr_width - 1, "] && (addr < ").concat(rom_depth, ") && rd_en")), out: 'rd_en_u' });
            _this.addAssign({ in: new TSSV_1.Expr('rd_en_l_d1? data_out_l : rd_en_u_d1? data_out_u : \'hx'), out: 'data_out' });
            if (rom_depth > 1) {
                _this.addAssign({ in: new TSSV_1.Expr("addr[".concat(addr_l_width - 1, ":0]")), out: 'addr_l' });
            }
            else {
                _this.addAssign({ in: new TSSV_1.Expr("addr[".concat(addr_l_width, ":0]")), out: 'addr_l' });
            }
            if (rom_depth - depth_splitting > 1) {
                _this.addAssign({ in: new TSSV_1.Expr("addr[".concat(addr_u_width - 1, ":0]")), out: 'addr_u' });
            }
            else {
                _this.addAssign({ in: new TSSV_1.Expr("addr[".concat(addr_u_width, ":0]")), out: 'addr_u' });
            }
            _this.addRegister({ d: 'rd_en_l', clk: 'clk', q: 'rd_en_l_d1' });
            _this.addRegister({ d: 'rd_en_u', clk: 'clk', q: 'rd_en_u_d1' });
            _this.addSubmodule("u_".concat(_this.params.name, "_lower"), new ROM({ name: "".concat(_this.params.name, "_lower"), dataWidth: _this.params.dataWidth, endianness: _this.params.endianness }, init_data_array_dec.slice(0, depth_splitting), rcf_path), { clk: 'clk', rd_en: 'rd_en_l', addr: 'addr_l', data_out: 'data_out_l' });
            _this.addSubmodule("u_".concat(_this.params.name, "_upper"), new ROM({ name: "".concat(_this.params.name, "_upper"), dataWidth: _this.params.dataWidth, endianness: _this.params.endianness }, init_data_array_dec.slice(depth_splitting), rcf_path), { clk: 'clk', rd_en: 'rd_en_u', addr: 'addr_u', data_out: 'data_out_u' });
        }
        else {
            // define rom`s body
            var rom_body = "\n      always_ff @(posedge clk) begin\n          if (rd_en) begin\n              case(addr)\n                  ".concat(signalArray.join('                  '), "\n                  default: data_out <= ").concat(_this.params.dataWidth, "'hx;\n              endcase\n          end\n      end\n      ");
            _this.addSequentialAlways({ clk: 'clk', outputs: ['data_out'] }, rom_body);
        }
        // write RCF file
        if (_this.rcf_path) {
            // Hexadecimal to Binary conversion
            var rcf_array = init_data_array_pad.map(function (hexString) {
                var binaryString = '';
                for (var i = 0; i < hexString.length; i++) {
                    var hexChar = hexString[i];
                    var binaryValue = parseInt(hexChar, 16).toString(2); // Convert hexadecimal to decimal number, then convert to binary string
                    binaryString += binaryValue.padStart(4, '0'); // Ensure that each hexadecimal string is converted to a 4-bit binary string
                }
                return binaryString;
            });
            // output RCF
            var rcf_FilePath = "".concat(_this.rcf_path, "/").concat(_this.params.name, ".rcf");
            var rcf_data = rcf_array.join('\n');
            fs.writeFile(rcf_FilePath, rcf_data, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
        return _this;
    }
    return ROM;
}(TSSV_1.Module));
exports.ROM = ROM;
exports.default = ROM;
