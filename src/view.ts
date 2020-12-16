import * as vscode from 'vscode';
import { DELIM_MSG, getFixedImports, showInformationMessage } from './common';
import { log } from './log';

export function fixImportsInDocument(baseUrlWithTrailingSlash: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    log('No active text editor was found');
    return;
  }

  const document = editor.document;
  editor.edit((editBuilder) => {
    editor.selections.forEach((selection) =>
      fixIt(document, editBuilder, selection, baseUrlWithTrailingSlash)
    );
  });
}

function fixIt(
  document: vscode.TextDocument,
  editBuilder: vscode.TextEditorEdit,
  sel: vscode.Selection,
  baseUrlWithTrailingSlash: string
) {
  const textRange: vscode.Range = sel.isEmpty ? getTextRange(document) : sel;
  const selectedText = document.getText(textRange);

  const { countFixes, newCode } = getFixedImports(
    document.fileName,
    selectedText,
    baseUrlWithTrailingSlash
  );
  editBuilder.replace(textRange, newCode);

  const msg = `${countFixes} relative import${
    countFixes === 1 ? '' : 's'
  } were fixed in ${document.fileName}`;
  showInformationMessage(msg);
  log(msg);
  log(DELIM_MSG);
}

function getTextRange(document: vscode.TextDocument): vscode.Range {
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  return new vscode.Range(firstLine.range.start, lastLine.range.end);
}
