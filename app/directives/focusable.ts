/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../typings/_custom.d.ts" />
import {Directive, ElementRef} from 'angular2/angular2';

@Directive({
    selector: '[focusable]',
    host: {
        "tabindex": 0,
        "(keyup)": "onFocusKeyUp($event)"
    }
})
export class FocusableDirective {
    elementRef: ElementRef;

    constructor(element: ElementRef) {
        this.elementRef = element;
    }

    onFocusKeyUp(event) {
         if (event.which == 13) {
            this.elementRef.nativeElement.click();
        }
    }
}