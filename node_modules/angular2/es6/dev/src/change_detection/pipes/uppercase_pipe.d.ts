import { Pipe, BasePipe, PipeFactory } from './pipe';
import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Implements uppercase transforms to text.
 *
 * # Example
 *
 * In this example we transform the user text uppercase.
 *
 *  ```
 * @Component({
 *   selector: "username-cmp"
 * })
 * @View({
 *   template: "Username: {{ user | uppercase }}"
 * })
 * class Username {
 *   user:string;
 * }
 *
 * ```
 */
export declare class UpperCasePipe extends BasePipe implements PipeFactory {
    supports(str: any): boolean;
    transform(value: string, args?: List<any>): string;
    create(cdRef: ChangeDetectorRef): Pipe;
}
