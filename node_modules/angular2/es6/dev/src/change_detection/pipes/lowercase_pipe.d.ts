import { Pipe, BasePipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Implements lowercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text lowercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp"
 * })
 * @View({
 *   template: "Username: {{ user | lowercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 */
export declare class LowerCasePipe extends BasePipe implements PipeFactory {
    supports(str: any): boolean;
    transform(value: string, args?: List<any>): string;
    create(cdRef: ChangeDetectorRef): Pipe;
}
