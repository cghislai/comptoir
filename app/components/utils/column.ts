/**
 * Created by cghislai on 31/10/15.
 */

import {LocaleTexts} from '../../client/utils/lang';

export class Column {
    title:LocaleTexts;
    name:string;
    weight:number;
    alignRight:boolean;
    alignCenter:boolean;

    constructor(name: string, weight: number, title: LocaleTexts = null, alignRight: boolean = false, alignCenter: boolean = false) {
        this.name = name;
        this.weight = weight;
        this.title = title;
        this.alignRight = alignRight;
        this.alignCenter = alignCenter;
    }
}