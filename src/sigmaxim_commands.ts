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
	console.log('Congratulations, your extension "sigmaxim-support" is now active!');

	// Define the configuration settings that you want to retrieve
	const configuration = vscode.workspace.getConfiguration('sigmaxim-support');
	// console.log(configuration);
	const saChmPath = configuration.get<string>('saChmPath');






	// THE CHM COMMAND HERE
    let saHelp = vscode.commands.registerCommand('sigmaxim-support.saHelp', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
		  vscode.window.showErrorMessage('No active text editor found.');
		  return;
		}
		const selection = editor.selection;
		const document = editor.document;
		let text: string;

		if (!selection.isEmpty) {
			// Get the selected text
			text = document.getText(selection);
		} else {
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
        terminal.sendText("start hh.exe "+saChmPath+"::/CMD_"+text+".htm");
        terminal.sendText('\r');
		vscode.window.showInformationMessage('SA Admin Guide for: '+text+' opened.');
	});



	// PRINTING HERE
	let saPrintVariable = vscode.commands.registerCommand('sigmaxim-support.printVariable', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
		  vscode.window.showErrorMessage('No active text editor found.');
		  return;
		}
		const selection = editor.selection;
		const document = editor.document;
		let text: string;

		if (!selection.isEmpty) {
			// Get the selected text
			text = document.getText(selection);
		} else {
			// Get the word at the cursor position
			const position = editor.selection.active;
			const wordRange = document.getWordRangeAtPosition(position);
			if (!wordRange) {
				vscode.window.showErrorMessage('No word selected or no word found at cursor.');
				return;
			}
			text = document.getText(wordRange);
		}


		const line = document.lineAt(selection.start.line);
		const indent = line.text.match(/^([\t ]+)/)?.[1] || '';
		const printStatement = `PRINT "${text}: %" ${text}`;
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
	let selListReorganization = vscode.commands.registerCommand('sigmaxim-support.selListReorganization', () => {
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
	let quickPackaging = vscode.commands.registerCommand('sigmaxim-support.quickPackaging', () => {


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
	let localSelList = vscode.commands.registerCommand('sigmaxim-support.localSelList', () => {

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
		let selListContentOrig = '';
		if (fs.existsSync(selListPath)) {
			selListContentOrig = fs.readFileSync(selListPath, 'utf-8');
		  } else {
			fs.writeFileSync(selListPath, '', 'utf-8');
		  }
		
		// REMOVE EMPTY LINES IN SEL LIST
		let selListContent = '';
		selListContent = selListContentOrig.replace(/^\s*[\r\n]/gm, '');



		// Search for all .tab files in the directory
		const filesInDirectory = fs.readdirSync(currentFileDirPath);
		// console.log(filesInDirectory);
		let allFiles: string[] = [];
		let allSubDir: string[] = [];
		for (const file of filesInDirectory) {
			const subfilepath = path.join(currentFileDirPath, file);
			const isDirectory = fs.statSync(subfilepath).isDirectory();

			console.log('subfilepath',subfilepath);
			console.log('directory',isDirectory);

			// Add all the tab file names to a list
			if (!isDirectory && file.endsWith('.tab')) {
				console.log('tab:',file);
				allFiles.push(file);
			}
			console.log('makes it here');
			if (isDirectory) {
					// const subdirectoryPath = path.join(subfilepath, file);
					console.log('subdir:',subfilepath);
					const filesInSubDirectory = fs.readdirSync(subfilepath);
					console.log('innerloop');
					innerloop:
					for (const subFile of filesInSubDirectory) {
						console.log(subFile,'here');
						const subsubFilePath = path.join(subfilepath, subFile);
						const isSubDirectory = fs.statSync(subsubFilePath).isDirectory();
						console.log('sub dir:',isSubDirectory);
						if (!isSubDirectory && subFile.endsWith('.tab')) {
							console.log('subfile:',subFile);
							console.log('file:',file);
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
				fs.appendFileSync(selListPath, `\n${newLine}`);
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
				fs.appendFileSync(selListPath, `\n${newLine}`);
			}
		}

		// need to add logic for if already open
		
		// need automatically clean up here 

        // Open sel_list.txt in VS Code
        vscode.workspace.openTextDocument(selListPath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });
	



	// PRODUCTIVITY TOOLS - REMOVING EMPTY LINES 
	let removeAllEmptyLines = vscode.commands.registerCommand('sigmaxim-support.removeAllEmptyLines', () => {

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
			const fullRange = new vscode.Range(
				activeEditor.document.positionAt(0),
				activeEditor.document.positionAt(text.length)
			);
			editBuilder.replace(fullRange, updatedText);
		  });
		}
	  });


	// PRODUCTIVITY TOOLS - REMOVING EMPTY LINES 
	let removeSelectedEmptyLines = vscode.commands.registerCommand('sigmaxim-support.removeSelectedEmptyLines', () => {

        // 1. Get path and file name/extension
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor window.');
            return;
        }
	
		const document = activeEditor.document;
		const selection = activeEditor.selection;
		

		if (!selection) {
            vscode.window.showErrorMessage('Function requires selection.');
            return;
        }

		if (!selection.isEmpty) {
			// Get the selected text
			const selectedText = document.getText(selection);

			// Remove empty lines from the selected text
			const updatedText = selectedText.replace(/^\s*[\r\n]/gm, '');

			// Replace the selected text with the updated text
			activeEditor.edit((editBuilder) => {
				editBuilder.replace(selection, updatedText);
			});	
		} 
	});


	// PRODUCTIVITY TOOLS - REMOVING EMPTY LINES 
	let backupCurrentFile = vscode.commands.registerCommand('sigmaxim-support.backupCurrentFile', () => {

        // 1. Get path and file name/extension
        const activeEditor = vscode.window.activeTextEditor;

		if (activeEditor) {
			const currentFilePath = activeEditor.document.uri.fsPath;
			if (!currentFilePath) {
				vscode.window.showErrorMessage('No document identified for backup.');
				return;
			}			
			const backupFilePath = currentFilePath + '.bak';
			fs.copyFileSync(currentFilePath, backupFilePath);
		}else{
            vscode.window.showErrorMessage('No active editor window.');
            return;
		}
	});


	// Move to other side
	let moveEditorToOtherSide = vscode.commands.registerCommand('sigmaxim-support.moveEditorToOtherSide', () => {


		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showInformationMessage('No active editor found.');
			return;
		}

		const activeGroup = activeEditor.viewColumn;
		const otherGroup = activeGroup === vscode.ViewColumn.One ? vscode.ViewColumn.Two : vscode.ViewColumn.One;

		const otherEditors = vscode.window.visibleTextEditors.filter(
			editor => editor.viewColumn === otherGroup
		);

		const otherEditorDocuments = otherEditors.map(editor => editor.document);
		vscode.workspace.openTextDocument(activeEditor.document.uri).then(document => {
			vscode.window.showTextDocument(document, otherGroup).then(newEditor => {
				vscode.window.showTextDocument(activeEditor.document, activeGroup).then(() => {
					otherEditorDocuments.forEach(doc => vscode.window.showTextDocument(doc, otherGroup));
					// newEditor.hide();
					// activeEditor.hide();
				});
			});
		});
	});


	// process_for_snippet
	let processSelectionForSnippet = vscode.commands.registerCommand('sigmaxim-support.processSelectionForSnippet', () => {

		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			vscode.window.showInformationMessage('No active editor found.');
			return;
		}
	
		const selection = activeEditor.selection;
		const selectedText = activeEditor.document.getText(selection);
	
		if (!selectedText) {
			vscode.window.showInformationMessage('No text selected.');
			return;
		}
	
		const processedLines = selectedText
			.replace(/\\/g, '\\\\')
			.replace(/\t/g, '\\t')
			.replace(/"/g, '\\"')
			.split('\n')
			.map(line => `"${line.trim()}"`)
			.join(',\n');

		const processedText = `${processedLines}`;
		
		vscode.workspace.openTextDocument({ content: processedText })
			.then(doc => {
				vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
			});
		
	});
		


	context.subscriptions.push(saHelp);
	context.subscriptions.push(saPrintVariable);
	context.subscriptions.push(selListReorganization);
	context.subscriptions.push(quickPackaging);
	context.subscriptions.push(localSelList);
	context.subscriptions.push(removeAllEmptyLines);
	context.subscriptions.push(removeSelectedEmptyLines);
	context.subscriptions.push(backupCurrentFile);
	context.subscriptions.push(moveEditorToOtherSide);
	context.subscriptions.push(processSelectionForSnippet);

}



// This method is called when your extension is deactivated
export function deactivate() {}



