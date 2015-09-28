/**
 * Created by cghislai on 07/08/15.
 */

import {Map} from 'immutable';

export interface Pagination extends Map<string, any>{
    pageIndex: number;
    firstIndex: number;
    pageSize: number;
    sorts: any; // [colName]='asc'|'desc'
}
export class PaginationFactory {

    static Pagination(firstIndex?: number, pageSize?: number) : Pagination{
        var paginationDesc: any = {};
        if (firstIndex != undefined) {
            paginationDesc.firstIndex = firstIndex;
        }
        if (pageSize != undefined) {
            paginationDesc.pageSize = pageSize;
        }
        return <Pagination>Map(paginationDesc);
    }
}