import { Renderer } from 'angular2/render';
import { ElementRef } from 'angular2/core';
import { NgControl } from './ng_control';
import { ControlValueAccessor } from './control_value_accessor';
/**
 * The accessor for writing a value and listening to changes on a checkbox input element.
 *
 *  # Example
 *  ```
 *  <input type="checkbox" [ng-control]="rememberLogin">
 *  ```
 */
export declare class CheckboxControlValueAccessor implements ControlValueAccessor {
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
    registerOnChange(fn: (_: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
}
