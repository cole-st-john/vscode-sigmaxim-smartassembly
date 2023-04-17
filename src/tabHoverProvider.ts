// Define your language's syntax highlighting and grammar here
import documentation from './documentation.js';



import * as vscode from 'vscode';
// Create a hover provider for your language
export function activate(context: vscode.ExtensionContext) {

    let provider = vscode.languages.registerHoverProvider('tab', {
        provideHover(document, position, token) {






          const wordRange = document.getWordRangeAtPosition(position);
          if (!wordRange) {
            return undefined;
          }
          const word = document.getText(wordRange);
      
          function isFunction(word) {
            return documentation[word] && documentation[word].type === 'function';
          }
          
          function isVariable(word) {
            return documentation[word] && documentation[word].type === 'variable';
          }





        // Check if the hovered word is a function or variable in your language
        if (isFunction(word)) {
            // If it's a function, return a description of the function
            const description = documentation[word].description;
            return new vscode.Hover(description);
        } else if (isVariable(word)) {
            // If it's a variable, return a description of the variable
            const description = documentation[word].description;
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