/**
 * Created by cghislai on 07/08/15.
 */
import {Component, EventEmitter, Attribute} from 'angular2/core';
import {NgIf} from 'angular2/common';

@Component({
    selector: 'dialogview',
    inputs: ['modal', 'closable', 'title'],
    outputs: ['close'],
    templateUrl: './components/utils/dialog/dialog.html',
    styleUrls: ['./components/utils/dialog/dialog.css'],
    directives: [NgIf]
})
export class DialogView {
    isModal:boolean;
    isClosable:boolean;
    visible:boolean;
    title:string;
    close = new EventEmitter();

    constructor(@Attribute('modal') modal:string,
                @Attribute('closable') closable:string) {
        this.isModal = modal === 'true';
        this.isClosable = closable === 'true';
        this.visible = true;
    }

    onContainerClick() {
        if (this.isModal || !this.isClosable) {
            return;
        }
        this.doClose();
    }

    doClose() {
        this.visible = false;
        this.close.next(null);
    }
}
