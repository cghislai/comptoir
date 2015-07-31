/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../typings/_custom.d.ts" />
import {Directive, ElementRef} from 'angular2/angular2';

// Autofocus the input field
@Directive({
    selector: 'input[autoFocus]'
})
export class AutoFocusDirective {
    constructor(element: ElementRef) {
        var nativeElement = element.nativeElement;
        if (nativeElement != null) {
            nativeElement.focus();
            setTimeout(function() {
                    nativeElement.setSelectionRange(0,nativeElement.value.length);
                }, 0);
        }
    }
}