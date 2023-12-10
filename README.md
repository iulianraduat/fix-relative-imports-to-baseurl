# Fix Relative Imports to baseUrl

[![Marketplace Version](https://img.shields.io/vscode-marketplace/v/iulian-radu-at.fix-relative-imports-to-baseurl)](https://marketplace.visualstudio.com/items?itemName=iulian-radu-at.fix-relative-imports-to-baseurl)
[![Installs](https://img.shields.io/vscode-marketplace/i/iulian-radu-at.fix-relative-imports-to-baseurl)](https://marketplace.visualstudio.com/items?itemName=iulian-radu-at.fix-relative-imports-to-baseurl)
[![Rating](https://img.shields.io/vscode-marketplace/r/iulian-radu-at.fix-relative-imports-to-baseurl)](https://marketplace.visualstudio.com/items?itemName=iulian-radu-at.fix-relative-imports-to-baseurl)
<a href="http://opensource.org/licenses/GPL-3.0" target="_blank" rel="noreferrer noopener"><img src="https://img.shields.io/badge/license-GPL-orange.svg?color=blue&amp;style=flat-square" alt="The GPL-3.0 License"></a>

Automatically find and fix all imports in a typescript file to be relative to baseUrl defined in tsconfig.json.

## Features

- Automatically find all imports in a .ts or .tsx file
- Automatically fix all imports to be relative to baseUrl defined in tsconfig.json
- The fix is applied only to imports found in a selected text (if any) or to all imports found in the file
- If there is no defined value for baseUrl then no changes will be made

## Benefices

- All imports from a file will use the same path no matter in whice file it is used
  - Less time with fixing the broken path after copying or moving the code in a differrent file
  - Searching for the path will display all files using exports from that file

## Usage

From a typescript file, using Ctrl+Shift+P (Command Palette), run the command "Fix relative imports to baseUrl defined in tsconfig.json" to fix all (selected) relative imports in it.

From any view, using Ctrl+Shift+P (Command Palette), run the command "Fix in all project files the relative imports to baseUrl defined in tsconfig.json" to fix all relative imports
found in the specified source folders. The default source folders is only "src" in the root folder of the project. The list of source folders can be changed in Settings in
"Fix relative imports to baseUrl: the list of folders to be scanned for relative imports".

To make Visual Studio Code suggests you the absolute path relative to baseUrl, you will need to set the in Preferences the "Preferences: Import Module Specifier" for both javascript and typescript to "non-relative".

![Settings import non relative](https://github.com/iulian-radu-at/fix-relative-imports-to-baseurl/raw/main/resources/settings-import-non-relative.jpg)

## Example

tsconfig.json:

```json
{
  "compilerOptions": {
    ...
    "baseUrl": "."
  }
}
```

/home/user/prj/a/src/view/common/components/code.tss (before)

```typescript
import React from 'react';
import Dropdown from '../dropdowns/SimpleDropDown';
import { onChange } from './utils';
```

/home/user/prj/a/src/view/common/components/code.tss (after)

```typescript
import React from 'react';
import Dropdown from 'src/common/dropdowns/SimpleDropDown';
import { onChange } from 'src/view/common/components/utils';
```

## Requirements

There are no special requirements.

## Extension Settings

- fixRelativeImportsToBaseurl.sources:

  - Fix relative imports to baseUrl: the list of folders to be scanned for relative imports
  - default src

- fixRelativeImportsToBaseurl.debug:

  - Fix relative imports to baseUrl: log all changes in an output window
  - default false

## Known Issues

For the moment there are no known issues.

## Change Log

See Change Log [here](CHANGELOG.md)

## Issues

Submit an [issue](https://github.com/iulian-radu-at/fix-relative-imports-to-baseurl/issues) if you find any bug or have any request.

## Contribution

Fork the [repo](https://github.com/iulian-radu-at/fix-relative-imports-to-baseurl) and submit pull requests.
