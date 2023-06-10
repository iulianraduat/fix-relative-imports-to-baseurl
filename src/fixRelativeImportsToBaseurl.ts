import * as path from 'path';
import * as vscode from 'vscode';
import { fixImportsInAllFiles } from './file';
import { pathResolve, readJsonFile } from './fsUtils';
import { log } from './log';
import { fixImportsInDocument } from './view';

export class FixRelativeImportsToBaseurlProvider {
  private workspaceRoot: string | undefined;

  constructor(workspaceFolders: Readonly<vscode.WorkspaceFolder[]>) {
    if (workspaceFolders.length !== 1) {
      log(`There are too many workspace folders (${workspaceFolders.length})`);
      return;
    }

    this.workspaceRoot = workspaceFolders[0].uri.fsPath;
  }

  public fixOne(): void {
    if (this.workspaceRoot === undefined) {
      log('No workspace root was found');
      return;
    }

    const baseUrl = this.getBaseUrl(this.workspaceRoot);
    if (baseUrl === undefined) {
      log('No baseUrl was found in jsconfig.json/tsconfig.json');
      vscode.window.showErrorMessage('No baseUrl was found in jsconfig.json/tsconfig.json');
      return;
    }

    const baseUrlWithTrailingSlash = this.getBaseUrlWithTrailingSlash(baseUrl);
    fixImportsInDocument(baseUrlWithTrailingSlash);
  }

  public fixAll(): void {
    if (this.workspaceRoot === undefined) {
      log('No workspace root was found');
      return;
    }

    const baseUrl = this.getBaseUrl(this.workspaceRoot);
    if (baseUrl === undefined) {
      log('No baseUrl was found in jsconfig.json/tsconfig.json');
      vscode.window.showErrorMessage('No baseUrl was found in jsconfig.json/tsconfig.json');
      return;
    }

    const baseUrlWithTrailingSlash = this.getBaseUrlWithTrailingSlash(baseUrl);
    fixImportsInAllFiles(this.workspaceRoot, baseUrlWithTrailingSlash);
  }

  /**
   * We read the tsconfig.json to find the baseUrl
   * @param path is the location of the project's root
   */
  private getBaseUrl(pathToPrj: string): string | undefined {
    const pathToTsconfig = pathResolve(pathToPrj, 'tsconfig.json');
    log(`Looking for tsconfig.json in '${pathToTsconfig}'`);
    const tsconfig = readJsonFile(pathToTsconfig);
    const baseUrl = tsconfig?.compilerOptions?.baseUrl;
    return baseUrl ? path.resolve(pathToPrj, baseUrl) : undefined;
  }

  private getBaseUrlWithTrailingSlash(baseUrl: string): string {
    return baseUrl.endsWith(path.sep) ? baseUrl : baseUrl + path.sep;
  }
}
