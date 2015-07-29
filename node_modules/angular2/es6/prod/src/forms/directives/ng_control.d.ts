import { ControlValueAccessor } from './control_value_accessor';
import { AbstractControlDirective } from './abstract_control_directive';
/**
 * An abstract class that all control directive extend.
 *
 * It binds a {@link Control} object to a DOM element.
 */
export declare class NgControl extends AbstractControlDirective {
    name: string;
    valueAccessor: ControlValueAccessor;
    validator: Function;
    path: List<string>;
    viewToModelUpdate(newValue: any): void;
}
