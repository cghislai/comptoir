/**
 * Created by cghislai on 07/08/15.
 */

import * as Immutable from 'immutable';

export interface Pagination extends Immutable.Map<string, any>{
    pageIndex: number;
    firstIndex: number;
    pageSize: number;
    sorts: any; // [colName]='asc'|'desc'
}
var PaginationRecord = Immutable.Record({
    pageIndex: null,
    firstIndex: null,
    pageSize: null,
    sorts: null
});
export class PageChangeEvent {
    pageIndex: number;
    firstIndex: number;
    pageSize: number;
}
export function NewPagination(desc: any) : Pagination {
    return <any>PaginationRecord(desc);
}
export function ApplyPageChangeEvent(pagination: Pagination, pageChange: PageChangeEvent) : Pagination {
    var paginationModel = pagination.toJS();
    paginationModel.pageIndex = pageChange.pageIndex;
    paginationModel.firstIndex = pageChange.firstIndex;
    paginationModel.pageSize = pageChange.pageSize;
    return NewPagination(paginationModel);
}

export class PaginationFactory {

    static Pagination(paginationDesc: any) : Pagination{
        return NewPagination(paginationDesc);
    }
}