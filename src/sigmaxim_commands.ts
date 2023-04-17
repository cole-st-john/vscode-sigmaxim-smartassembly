// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-sigmaxim-smartassembly" is now active!');






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
        const text = editor.document.getText(selection);
		console.log(text);
		// console.log('sending text');
        const terminal = vscode.window.createTerminal();
        // terminal.sendText("C:/Users/info/OneDrive/1.ddc/3.%20SIGMAXIM/HELP_LINK/AdminGuide.chm::/CMD_"+text+".htm");
        terminal.sendText("start hh.exe C:/Users/info/OneDrive/1.ddc/3.%20SIGMAXIM/HELP_LINK/AdminGuide.chm::/CMD_"+text+".htm");
        terminal.sendText('\r');
		vscode.window.showInformationMessage('Showed Admin Guide for: '+text);
	});






	// PRINTING HERE
	let saPrintVariable = vscode.commands.registerCommand('vscode-sigmaxim-smartassembly.printVariable', () => {
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
		const indent = line.text.match(/^([\t ]+)/)?.[1] || '';
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
				editBuilder.insert(new vscode.Position(selection.end.line+1, 0), `${indent}${printStatement}\n`);
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

        // 3. Create sel_list.txt if it doesn't exist
        if (!fs.existsSync(selListPath)) {
            fs.writeFileSync(selListPath, '');
        }

		// READ THE SEL_LIST 
		let selListContent = '';
		if (fs.existsSync(selListPath)) {
			selListContent = fs.readFileSync(selListPath, 'utf-8');
		  } else {
			fs.writeFileSync(selListPath, '', 'utf-8');
		  }	


		// Search for all .tab files in the directory
		const filesInDirectory = fs.readdirSync(currentFileDirPath);
		let allFiles: string[] = [];
		let allSubDir: string[] = [];
		for (const file of filesInDirectory) {
			// const filePath = path.join(currentFileDirPath, file);
			const isDirectory = fs.statSync(filePath).isDirectory();
			// if (!isDirectory && file.endsWith('.tab')) {
			if (file.endsWith('.tab')) {
				// console.log(file);
				allFiles.push(file);
			}
			if (isDirectory) {
				// console.log(file);
					const subdirectoryPath = path.join(filePath, file);
					const filesInSubDirectory = fs.readdirSync(subdirectoryPath);
				
					for (const file of filesInSubDirectory) {
						const filePath = path.join(subdirectoryPath, file);
						const isDirectory = fs.statSync(filePath).isDirectory();
						if (!isDirectory && file.endsWith('.tab')) {
							allSubDir.push(file);
						}
					}
				
			}
		}

		console.log(allFiles);

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
		

        // Open sel_list.txt in VS Code
        vscode.workspace.openTextDocument(selListPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
	

	
	
	context.subscriptions.push(saHelp);
	context.subscriptions.push(saPrintVariable);
	context.subscriptions.push(selListReorganization);
	context.subscriptions.push(quickPackaging);
	context.subscriptions.push(localSelList);

}

// This method is called when your extension is deactivated
export function deactivate() {}


