"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
// Define your language's syntax highlighting and grammar here
const documentation_js_1 = require("./documentation.js");
const vscode = require("vscode");
// Create a hover provider for your language
function activate(context) {
    let provider = vscode.languages.registerHoverProvider('tab', {
        provideHover(document, position, token) {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return undefined;
            }
            const word = document.getText(wordRange);
            function isFunction(word) {
                return documentation_js_1.default[word] && documentation_js_1.default[word].type === 'function';
            }
            function isVariable(word) {
                return documentation_js_1.default[word] && documentation_js_1.default[word].type === 'variable';
            }
            // Check if the hovered word is a function or variable in your language
            if (isFunction(word)) {
                // If it's a function, return a description of the function
                const description = documentation_js_1.default[word].description;
                return new vscode.Hover(description);
            }
            else if (isVariable(word)) {
                // If it's a variable, return a description of the variable
                const description = documentation_js_1.default[word].description;
                return new vscode.Hover(description);
            }
            return undefined;
        }
    });
    // 	let provider = vscode.languages.registerHoverProvider('tab', {
    //     provideHover(document, position, token) {
    //       const wordRange = document.getWordRangeAtPosition(position);
    //       if (!wordRange) {
    //         return undefined;
    //       }
    //       const word = document.getText(wordRange);
    //       // Check if the hovered word is a function or keyword in your language
    //       if (isFunction(word)) {
    //         // If it's a function, return a description of the function
    //         const description = getFunctionDescription(word);
    //         return new vscode.Hover(description);
    //       } else if (isKeyword(word)) {
    //         // If it's a keyword, return a description of the keyword
    //         const description = getKeywordDescription(word);
    //         return new vscode.Hover(description);
    //       }
    //       return undefined;
    //     }
    //   });
    // Define your language-specific isFunction(), getFunctionDescription(),
    // isKeyword(), and getKeywordDescription() functions here
    context.subscriptions.push(provider);
}
exports.activate = activate;
//# sourceMappingURL=tabHoverProvider.js.map