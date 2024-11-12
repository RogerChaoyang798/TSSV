"use strict";
// import { renderWaveForm } from 'wavedrom'
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.WaveDromPlugin = void 0;
var typedoc = require("typedoc");
function createHeadScript() {
    return String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js\" type=\"text/javascript\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js\" type=\"text/javascript\"></script>  \n"], ["\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/skins/default.js\" type=\"text/javascript\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.1.0/wavedrom.min.js\" type=\"text/javascript\"></script>  \n"])));
}
function createBodyScript() {
    return String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n<script>\n    const h4Elements = document.querySelectorAll('h4');\n    h4Elements.forEach(h4Element => {\n        if (h4Element.textContent === 'Wavedrom') {\n            h4Element.parentNode.removeChild(h4Element);\n        }\n    });\n    WaveDrom.ProcessAll();\n</script>\n"], ["\n<script>\n    const h4Elements = document.querySelectorAll('h4');\n    h4Elements.forEach(h4Element => {\n        if (h4Element.textContent === 'Wavedrom') {\n            h4Element.parentNode.removeChild(h4Element);\n        }\n    });\n    WaveDrom.ProcessAll();\n</script>\n"])));
}
var wavedromBlockStart = '<div style="background-color: white;"><script type="WaveDrom">';
var wavedromBlockEnd = '</script></div>';
var WaveDromPlugin = /** @class */ (function () {
    function WaveDromPlugin(app) {
        this.app = app;
    }
    WaveDromPlugin.prototype.initialize = function () {
        var _this = this;
        this.app.converter.on(typedoc.Converter.EVENT_RESOLVE_BEGIN, function (context) {
            _this.onResolveBegin(context);
        });
        this.app.renderer.on(typedoc.PageEvent.END, function (event) {
            _this.onEndPage(event);
        });
    };
    WaveDromPlugin.prototype.onResolveBegin = function (context) {
        var _this = this;
        context.project.getReflectionsByKind(typedoc.ReflectionKind.All).forEach(function (reflection) {
            if (reflection.comment) {
                reflection.comment.getTags('@wavedrom').forEach(function (part) {
                    console.log('WAVEDROM!!!!');
                    var p = part.content[0];
                    // Regex to match code blocks
                    var codeBlockRegex = /```(?:\w+)?\s*([\s\S]+?)\s*```/g;
                    var match;
                    if (p === null || p === void 0 ? void 0 : p.text) {
                        if ((match = codeBlockRegex.exec(p.text)) !== null) {
                            p.text = _this.renderWaveDrom(match[1]);
                        }
                    }
                });
            }
        });
    };
    WaveDromPlugin.prototype.renderWaveDrom = function (waveDromCode) {
        return "".concat(wavedromBlockStart).concat(waveDromCode).concat(wavedromBlockEnd);
    };
    WaveDromPlugin.prototype.onEndPage = function (event) {
        if (event.contents !== undefined) {
            event.contents = this.insertWaveDromScript(event.contents);
        }
    };
    WaveDromPlugin.prototype.insertWaveDromScript = function (html) {
        if (!html.includes(wavedromBlockStart)) {
            // this page doesn't need to load WaveDrom
            return html;
        }
        // find the closing </body> tag and insert our mermaid scripts
        var headEndIndex = html.indexOf('</head>');
        html = html.slice(0, headEndIndex) + createHeadScript() + html.slice(headEndIndex);
        // find the closing </body> tag and insert our mermaid scripts
        var bodyEndIndex = html.lastIndexOf('</body>');
        return (html.slice(0, bodyEndIndex) +
            createBodyScript() +
            html.slice(bodyEndIndex));
    };
    return WaveDromPlugin;
}());
exports.WaveDromPlugin = WaveDromPlugin;
function load(app) {
    new WaveDromPlugin(app).initialize();
}
exports.load = load;
var templateObject_1, templateObject_2;
