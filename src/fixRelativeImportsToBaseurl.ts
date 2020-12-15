import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { log } from './log';

export class FixRelativeImportsToBaseurlProvider {
  private workspaceRoot: string | undefined;

  constructor(workspaceFolders: Readonly<vscode.WorkspaceFolder[]>) {
    if (workspaceFolders.length !== 1) {
      log(`There are too many workspace folders (${workspaceFolders.length})`);
      return;
    }

    this.workspaceRoot = workspaceFolders[0].uri.fsPath;
  }

  public fix(): void {
    if (this.workspaceRoot === undefined) {
      log('No workspace root was found');
      return;
    }

    const baseUrl = this.getBaseUrl(this.workspaceRoot);
    if (baseUrl === undefined) {
      log('No baseUrl was found');
      return;
    }
    const baseUrlWithTrailingSlash = baseUrl + path.sep;

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      log('No active text editor was found');
      return;
    }

    const document = editor.document;
    editor.edit((editBuilder) => {
      editor.selections.forEach((selection) =>
        this.fixImports(
          document,
          editBuilder,
          selection,
          baseUrlWithTrailingSlash
        )
      );
    });
  }

  /**
   * We read the tsconfig.json to find the baseUrl
   * @param path is the location of the project's root
   */
  private getBaseUrl(pathToPrj: string): string | undefined {
    const pathToTsconfig = path.resolve(pathToPrj, 'tsconfig.json');
    log(`Looking for tsconfig.json in '${pathToTsconfig}'`);
    const tsconfig = this.readJsonFile(pathToTsconfig);
    const baseUrl = tsconfig?.compilerOptions?.baseUrl;
    return baseUrl ? path.resolve(pathToPrj, baseUrl) : undefined;
  }

  private readJsonFile(path: string): { [kes: string]: any } | undefined {
    try {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch {
      return undefined;
    }
  }

  private fixImports(
    document: vscode.TextDocument,
    editBuilder: vscode.TextEditorEdit,
    sel: vscode.Selection,
    baseUrl: string
  ) {
    const dirPath = path.dirname(document.fileName);

    const textRange: vscode.Range = sel.isEmpty
      ? this.getTextRange(document)
      : sel;
    const selectedText = document.getText(textRange);

    let countFixes = 0;
    const newText = selectedText.replace(
      /(import\s+.+?\s+from\s*["'])((?:\.|\.\.)[\/\\][^"']+)(["'])/gs,
      (match, importPrefixAndOpenQuote, relativePath, closeQuote) => {
        countFixes++;

        const filePath = path.resolve(dirPath, relativePath);
        const newRelativePath = filePath
          .substr(baseUrl.length)
          .replace(/\\/g, '/');
        const newImport = `${importPrefixAndOpenQuote}${newRelativePath}${closeQuote}`;
        log(`Replaced <${match}> with <${newImport}>`);
        return newImport;
      }
    );
    editBuilder.replace(textRange, newText);

    const msg = `${countFixes} relative imports were fixed in ${document.fileName}`;
    this.showInformationMessage(msg);
    log(msg);
    log(
      '------------------------------------------------------------------------'
    );
  }

  private getTextRange(document: vscode.TextDocument): vscode.Range {
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    return new vscode.Range(firstLine.range.start, lastLine.range.end);
  }

  private showInformationMessage(msg: string) {
    vscode.window.showInformationMessage(msg);
  }
}
