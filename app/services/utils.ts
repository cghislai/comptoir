/**
 * Created by cghislai on 02/08/15.
 */

export class Pagination {
    pageIndex: number;
    firstIndex: number;
    pageSize: number;

    constructor();
    constructor(firstIndex: number, pageSize: number);
    constructor(firstIndex?: number, pageSize?: number) {
        if (firstIndex != undefined) {
            this.firstIndex = firstIndex;
        }
        if (pageSize != undefined) {
            this.pageSize = pageSize;
        }
    }
}