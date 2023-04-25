"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-sigmaxim-smartassembly" is now active!');
    // Define the configuration settings that you want to retrieve
    const configuration = vscode.workspace.getConfiguration('vscode-sigmaxim-smartassembly');
    // console.log(configuration);
    const saChmPath = configuration.get('saChmPath');
    // console.log(saChmPath);
    // THE CHM COMMAND HERE
    let saHelp = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.saHelp', () => {
        // console.log('inside!');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            // console.log('in if');
            vscode.window.showErrorMessage('No active text editor');
            return;
        }
        const selection = editor.selection;
        // const text = editor.document.getText(selection);
        const document = editor.document;
        let text;
        if (!selection.isEmpty) {
            // Get the selected text
            text = document.getText(selection);
        }
        else {
            // Get the word at the cursor position
            const position = editor.selection.active;
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                vscode.window.showErrorMessage('No word selected or no word found at cursor.');
                return;
            }
            text = document.getText(wordRange);
        }
        // console.log(text);
        // console.log('sending text');
        const terminal = vscode.window.createTerminal();
        // terminal.sendText("C:/Users/info/OneDrive/1.ddc/3.%20SIGMAXIM/HELP_LINK/AdminGuide.chm::/CMD_"+text+".htm");
        terminal.sendText("start hh.exe " + saChmPath + "::/CMD_" + text + ".htm");
        terminal.sendText('\r');
        vscode.window.showInformationMessage('SA Admin Guide for: ' + text + ' opened.');
    });
    // PRINTING HERE
    let saPrintVariable = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.printVariable', () => {
        var _a;
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active text editor found.');
            return;
        }
        const document = editor.document;
        const selection = editor.selection;
        const word = document.getText(selection).trim();
        if (!word) {
            vscode.window.showErrorMessage('No word selected.');
            return;
        }
        const line = document.lineAt(selection.start.line);
        const indent = ((_a = line.text.match(/^([\t ]+)/)) === null || _a === void 0 ? void 0 : _a[1]) || '';
        const printStatement = `PRINT "${word}: %" ${word}`;
        const currentLine = selection.active.line;
        const totalLines = document.lineCount;
        editor.edit(editBuilder => {
            if (currentLine === totalLines - 1) {
                const lastLine = document.lineAt(document.lineCount - 1);
                const endOfLastLine = new vscode.Position(document.lineCount - 1, lastLine.range.end.character);
                console.log(`End of last line: (${endOfLastLine.line}, ${endOfLastLine.character})`);
                editBuilder.insert(new vscode.Position(document.lineCount - 1, lastLine.range.end.character), `\n`);
                editBuilder.insert(new vscode.Position(document.lineCount, 0), `${indent}${printStatement}`);
                console.log('Selection is on the last line of the document');
            }
            else {
                editBuilder.insert(new vscode.Position(selection.end.line + 1, 0), `${indent}${printStatement}\n`);
                console.log('Selection is not on the last line of the document');
            }
        });
    });
    // ORGANIZING A SEL LIST HERE 
    let selListReorganization = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.selListReorganization', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            let text = editor.document.getText();
            // console.log(text);
            let newText = text.replace(/([\t ]+)$|([\t ]*!.*)$|^([\t ]+)/gm, "")
                .replace(/[ \t]{1,}/gm, " ")
                .replace(/^(\b\w+)(\b[\t ]+)(\b\w+\b)([\t ]+[Hh][iI][dD][eE]){0,1}$/gm, "$1                                                       $3$4")
                .replace(/^(.{55})([\t ]+)(\b\w+\b.*?)$/gm, "$1$3")
                .replace(/(\s*\n)+$/gm, "")
                .replace(/^(.*)$/gm, match => match.toUpperCase());
            editor.edit(builder => builder.replace(new vscode.Range(0, 0, editor.document.lineCount, 0), newText));
            vscode.window.showInformationMessage("Sel List Reorganization is complete.");
        }
        else {
            vscode.window.showErrorMessage("No active text editor found.");
        }
    });
    // CREATE SEL_LIST.txt
    let quickPackaging = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.quickPackaging', () => {
        // 1. Get path and file name/extension
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor for a file path to add to sel_list.txt.');
            return;
        }
        const filePath = activeEditor.document.uri.fsPath;
        const fileBasename = path.basename(filePath);
        const [fileName, fileExt] = fileBasename.split('.');
        // 2. Look for sel_list.txt
        const selListPath = path.join(path.dirname(filePath), 'sel_list.txt');
        // 3. Create sel_list.txt if it doesn't exist
        if (!fs.existsSync(selListPath)) {
            fs.writeFileSync(selListPath, '');
        }
        // 4. Check if filename exists in sel_list.txt
        const selListContents = fs.readFileSync(selListPath, 'utf-8');
        const regex = new RegExp(`^${fileName} .*`, 'm');
        const found = selListContents.match(regex);
        // 5. Add filename to sel_list.txt if not found
        if (!found) {
            const newLine = `${fileName} UDF`;
            fs.appendFileSync(selListPath, `${newLine}\n`);
        }
        // 6. Open sel_list.txt in VS Code
        vscode.workspace.openTextDocument(selListPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
    // CREATING LOCAL PATH SEL_LIST.txt
    let localSelList = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.localSelList', () => {
        vscode.window.showInformationMessage('Building an updated Sel_list.txt file...');
        // 1. Get path and file name/extension
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor for a file path to check for sel_list.txt.');
            return;
        }
        const filePath = activeEditor.document.uri.fsPath;
        // Get the directory path of the current file
        const currentFileDirPath = path.dirname(filePath);
        // 2. Look for sel_list.txt
        const selListPath = path.join(path.dirname(filePath), 'sel_list.txt');
        console.log(selListPath);
        // 3. Create sel_list.txt if it doesn't exist
        if (!fs.existsSync(selListPath)) {
            fs.writeFileSync(selListPath, '');
        }
        // READ THE SEL_LIST 
        let selListContent = '';
        if (fs.existsSync(selListPath)) {
            selListContent = fs.readFileSync(selListPath, 'utf-8');
        }
        else {
            fs.writeFileSync(selListPath, '', 'utf-8');
        }
        // Search for all .tab files in the directory
        const filesInDirectory = fs.readdirSync(currentFileDirPath);
        // console.log(filesInDirectory);
        let allFiles = [];
        let allSubDir = [];
        for (const file of filesInDirectory) {
            const subfilepath = path.join(currentFileDirPath, file);
            const isDirectory = fs.statSync(subfilepath).isDirectory();
            console.log('subfilepath', subfilepath);
            console.log('directory', isDirectory);
            // Add all the tab file names to a list
            if (!isDirectory && file.endsWith('.tab')) {
                console.log('tab:', file);
                allFiles.push(file);
            }
            console.log('makes it here');
            if (isDirectory) {
                // const subdirectoryPath = path.join(subfilepath, file);
                console.log('subdir:', subfilepath);
                const filesInSubDirectory = fs.readdirSync(subfilepath);
                console.log('innerloop');
                innerloop: for (const subFile of filesInSubDirectory) {
                    console.log(subFile, 'here');
                    const subsubFilePath = path.join(subfilepath, subFile);
                    const isSubDirectory = fs.statSync(subsubFilePath).isDirectory();
                    console.log('sub dir:', isSubDirectory);
                    if (!isSubDirectory && subFile.endsWith('.tab')) {
                        console.log('subfile:', subFile);
                        console.log('file:', file);
                        allSubDir.push(file);
                        break innerloop;
                    }
                }
            }
        }
        console.log(allFiles);
        console.log(allSubDir);
        for (const file of allFiles) {
            // Check if filename exists in sel_list.txt
            const [fileName, fileExt] = file.split('.');
            const regex = new RegExp(`^\\s*${fileName}\\s\.*UDF.*`, 'mi');
            // const regex = new RegExp(`^\s*${fileName}\s.*UDF.*`, 'm');
            const found = selListContent.match(regex);
            // Add filename to sel_list.txt if not found
            if (!found) {
                const newLine = `${fileName}      UDF`;
                fs.appendFileSync(selListPath, `${newLine}\n`);
            }
        }
        for (const file of allSubDir) {
            // Check if filename exists in sel_list.txt
            const regex = new RegExp(`^\\s*${file}\\s\.*DIR.*`, 'mi');
            const found = selListContent.match(regex);
            console.log(file);
            // Add dir to sel_list.txt if not found
            if (!found) {
                console.log('not found');
                const newLine = `${file}      DIR`;
                fs.appendFileSync(selListPath, `${newLine}\n`);
            }
        }
        // Open sel_list.txt in VS Code
        vscode.workspace.openTextDocument(selListPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
    // PRODUCTIVITY TOOLS - REMOVING EMPTY LINES 
    let removeEmptyLines = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.removeEmptyLines', () => {
        // 1. Get path and file name/extension
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor window.');
            return;
        }
        if (activeEditor) {
            const text = activeEditor.document.getText();
            const updatedText = text.replace(/^\s*[\r\n]/gm, '');
            activeEditor.edit(editBuilder => {
                const fullRange = new vscode.Range(activeEditor.document.positionAt(0), activeEditor.document.positionAt(text.length));
                editBuilder.replace(fullRange, updatedText);
            });
        }
    });
    context.subscriptions.push(saHelp);
    context.subscriptions.push(saPrintVariable);
    context.subscriptions.push(selListReorganization);
    context.subscriptions.push(quickPackaging);
    context.subscriptions.push(localSelList);
    context.subscriptions.push(removeEmptyLines);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=sigmaxim_commands.js.map