import { Renderer } from 'angular2/render';
import { ElementRef } from 'angular2/core';
import { NgControl } from './ng_control';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * The default accessor for writing a value and listening to changes that is used by the
 * {@link NgModel}, {@link NgFormControl}, and {@link NgControlName} directives.
 *
 *  # Example
 *  ```
 *  <input type="text" [(ng-model)]="searchQuery">
 *  ```
 */
export declare class DefaultValueAccessor implements ControlValueAccessor {
    private renderer;
    private elementRef;
    private cd;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(cd: NgControl, renderer: Renderer, elementRef: ElementRef);
    writeValue(value: any): void;
    ngClassUntouched: boolean;
    ngClassTouched: boolean;
    ngClassPristine: boolean;
    ngClassDirty: boolean;
    ngClassValid: boolean;
    ngClassInvalid: boolean;
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
}
