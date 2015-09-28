/**
 * Created by cghislai on 07/08/15.
 */

import {Map, Record} from 'immutable';

export interface Pagination extends Map<string, any>{
    pageIndex: number;
    firstIndex: number;
    pageSize: number;
    sorts: any; // [colName]='asc'|'desc'
}
var PaginationRecord = Record({
    pageIndex: null,
    firstIndex: null,
    pageSize: null,
    sorts: null
});
export function NewPagination(desc: any) : Pagination {
    return <any>PaginationRecord(desc);
}

export class PaginationFactory {

    static Pagination(paginationDesc: any) : Pagination{
        return NewPagination(paginationDesc);
    }
}