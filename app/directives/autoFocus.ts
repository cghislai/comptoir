/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../typings/_custom.d.ts" />
import {Directive, ViewContainerRef} from 'angular2/angular2';

// A autofocus directive to focus reduction fieds
@Directive({
    selector: 'input[autoFocus]'
})
export class AutoFocusDirective {
    viewContainer: ViewContainerRef;
    constructor(viewContainer: ViewContainerRef) {
        this.viewContainer = viewContainer;
        viewContainer.element.nativeElement.focus();
        console.log(this);
    }
}