/**
 * Created by cghislai on 02/08/15.
 */


import {Component, View, Attribute, EventEmitter, NgFor} from 'angular2/angular2';

export class Pagination {
    pageIndex: number;
    recordFirstIndex: number;
    pageSize: number;
}

@Component({
    selector: 'paginator',
    events: ['pagechange']
})
@View({
    templateUrl: './components/utils/paginator/paginator.html',
    styleUrls: ['./components/utils/paginator/paginator.css'],
    directives: [NgFor]
})

export class Paginator {
    pageCount: number;
    pageSize: number;
    totalCount: number;
    showPrevNextLink: boolean;
    showFirstLastLink: boolean;
    pages: number[];
    activePage: number;
    pagechange: EventEmitter;
    maxPageLinks: number = 10;

    constructor(@Attribute('total-count') totalCount,
                @Attribute('page-size') pageSize,
                @Attribute('show-prev-next') showPrevNext,
                @Attribute('show-first-last') showFirstLast) {
        this.totalCount = parseInt(totalCount);
        this.pageSize = parseInt(pageSize);
        this.pageCount = Math.ceil(this.totalCount / this.pageSize);
        this.showFirstLastLink = showFirstLast;
        this.showPrevNextLink = showPrevNext;
        this.activePage = 0;
        this.pagechange = new EventEmitter();
        this.buildPagesLinksArray();
    }

    buildPagesLinksArray() {
        this.pages = [];
        var pageLinkShown = 0;
        var firstIndex = this.activePage - this.maxPageLinks / 2;
        firstIndex = Math.max(firstIndex, 0);
        var lastIndex = firstIndex + this.maxPageLinks;
        lastIndex = Math.min(lastIndex, this.pageCount - 1);
        for (var pageIndex = firstIndex; pageIndex <= lastIndex; pageIndex++) {
            this.pages.push(pageIndex);
        }
    }

    goToFirst() {
        this.goToPage(0);
    }
    goToLast() {
        this.goToPage(this.pageCount - 1);
    }
    goToPrev() {
        if (this.activePage == 0) {
            return;
        }
        this.goToPage(this.activePage - 1);
    }
    goToNext() {
        if (this.activePage >= this.pageCount - 1) {
            return;
        }
        this.goToPage(this.activePage + 1);
    }

    goToPage(pageIndex: number) {
        this.activePage = pageIndex;
        var pagination = new Pagination();
        pagination.pageIndex = pageIndex;
        var firstIndex = pageIndex * this.pageSize;
        var pageSize = Math.min(this.pageSize, this.totalCount - firstIndex);
        pagination.recordFirstIndex = firstIndex;
        pagination.pageSize = pageSize;
        this.buildPagesLinksArray();

        this.pagechange.next(pagination);
    }

}