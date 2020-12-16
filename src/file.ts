import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import * as vscode from 'vscode';
import { DELIM_MSG, getFixedImports, showInformationMessage } from './common';
import { log } from './log';

export function fixImportsInAllFiles(
  workspaceRoot: string,
  baseUrlWithTrailingSlash: string
) {
  const srcFolders = getSrcFolders();

  let totalCountFixes: number = 0;
  let totalCountFiles: number = 0;

  srcFolders.forEach((folder) => {
    const { countFixes, countFiles } = fixImportsInAFile(
      path.resolve(workspaceRoot, folder),
      baseUrlWithTrailingSlash
    );
    totalCountFixes += countFixes;
    totalCountFiles += countFiles;
  });

  const msg = `${totalCountFixes} relative ${singularOrPlural(
    'import',
    totalCountFixes
  )} were fixed in ${totalCountFiles} ${singularOrPlural(
    'file',
    totalCountFiles
  )}`;
  showInformationMessage(msg);

  log(msg);
  log(DELIM_MSG);
}

function singularOrPlural(label: string, count: number) {
  return label + (count === 1 ? '' : 's');
}

function fixImportsInAFile(
  folder: string,
  baseUrlWithTrailingSlash: string
): { countFixes: number; countFiles: number } {
  const tsFiles = glob.sync(folder + '/**/*.ts?(x)', {
    ignore: [path.resolve(folder, 'node_modules', '**')],
  });
  if (tsFiles.length === 0) {
    const msg = 'No typescript files (.ts or .tsx) were found';
    log(msg);
    showInformationMessage(msg);
    return { countFixes: 0, countFiles: 0 };
  }

  let countFiles: number = 0;
  const countFixes: number = tsFiles.reduce(
    (prev: number, filePath: string) => {
      const numFixes = fixIt(filePath, baseUrlWithTrailingSlash);
      if (numFixes === 0) {
        return prev;
      }

      countFiles++;
      return prev + numFixes;
    },
    0
  );
  return { countFixes, countFiles };
}

function getSrcFolders(): string[] {
  return vscode.workspace
    .getConfiguration()
    .get('fixRelativeImportsToBaseurl.sources', ['src']);
}

function fixIt(filePath: string, baseUrlWithTrailingSlash: string): number {
  log('Checking', filePath);
  const code = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });

  const { countFixes, newCode } = getFixedImports(
    filePath,
    code,
    baseUrlWithTrailingSlash
  );

  if (countFixes > 0) {
    fs.writeFileSync(filePath, newCode, { encoding: 'utf8' });
  }

  return countFixes;
}
