import { x } from '../importme';
import { y } from '../test4/importme';

/**
 * To use me for tests you need to add in tsconfig.json
 * {
 *   "compilerOptions": {
 *     "baseUrl": "."
 *   }
 * }
 */

console.log(x());
console.log(y());
