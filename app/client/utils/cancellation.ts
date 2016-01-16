/**
 * Created by cghislai on 14/01/16.
 */


import { Observable } from 'rxjs/Observable';

export class Cancellation {
    onCancel:Observable<any>;

    constructor() {
        this.onCancel = new Observable<any>();
    }
}