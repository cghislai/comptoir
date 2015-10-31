/**
 * Created by cghislai on 07/08/15.
 */
import {Component, View, EventEmitter, NgIf, Attribute} from 'angular2/angular2';

@Component({
    selector: 'dialogview',
    inputs: ['modal', 'closable', 'title'],
    outputs: ['close']
})
@View({
    templateUrl: './components/utils/dialog/dialog.html',
    styleUrls: ['./components/utils/dialog/dialog.css'],
    directives: [NgIf]
})
export class DialogView {
    isModal:boolean;
    isClosable:boolean;
    visible:boolean;
    title:string;
    close:EventEmitter = new EventEmitter();

    constructor(@Attribute('modal') modal:string,
                @Attribute('closable') closable:string) {
        this.isModal = modal == "true";
        this.isClosable = closable == "true";
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