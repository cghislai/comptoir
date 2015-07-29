import { Pipe, BasePipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Implements json transforms to any object.
 *
 * # Example
 *
 * In this example we transform the user object to json.
 *
 *  ```
 * @Component({
 *   selector: "user-cmp"
 * })
 * @View({
 *   template: "User: {{ user | json }}"
 * })
 * class Username {
 *  user:Object
 *  constructor() {
 *    this.user = { name: "PatrickJS" };
 *  }
 * }
 *
 * ```
 */
export declare class JsonPipe extends BasePipe implements PipeFactory {
    transform(value: any, args?: List<any>): string;
    create(cdRef: ChangeDetectorRef): Pipe;
}
