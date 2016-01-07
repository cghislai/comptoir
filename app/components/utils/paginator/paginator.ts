/**
 * Created by cghislai on 02/08/15.
 */

import {Component, EventEmitter, OnInit, OnChanges, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {PageChangeEvent} from '../../../client/utils/pagination';

@Component({
    selector: 'paginator',
    outputs: ['pageChange'],
    inputs: ['totalCount', 'pageSize',
        'showPrevNextLink', 'showFirstLastLink'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/utils/paginator/paginator.html',
    styleUrls: ['./components/utils/paginator/paginator.css'],
    directives: [NgFor]
})

export class Paginator implements OnInit, OnChanges {
    pageCount:number;
    pageSize: number;
    totalCount: number;

    showPrevNextLink:boolean;
    showFirstLastLink:boolean;
    pages:number[];
    activePage:number;
    maxPageLinks:number = 10;
    pageChange  ;

    constructor() {
        this.activePage = 0;
        this.pageChange = new EventEmitter();
    }

    ngOnInit() {
        this.buildPagesLinksArray();
    }

    ngOnChanges() {
        this.buildPagesLinksArray();
    }

    buildPagesLinksArray() {
        if (this.totalCount == null) {
            return;
        }
        this.pages = [];
        this.pageCount = Math.ceil(this.totalCount / this.pageSize);

        var firstIndex = this.activePage - this.maxPageLinks / 2;
        firstIndex = Math.max(firstIndex, 0);
        var lastIndex = firstIndex + this.maxPageLinks;
        lastIndex = Math.min(lastIndex, this.pageCount - 1);
        for (var pageIndex = firstIndex; pageIndex <= lastIndex; pageIndex++) {
            this.pages.push(pageIndex);
        }
    }

    set totalCountParam(value:string) {
        this.totalCount = parseInt(value);
        this.buildPagesLinksArray();
    }
    set pageSizeParam(value:string) {
        this.pageSize = parseInt(value);
        this.buildPagesLinksArray();
    }
    goToFirst() {
        if (this.activePage <= 0) {
            return;
        }
        this.goToPage(0);
    }

    goToLast() {
        if (this.activePage >= this.pageCount - 1) {
            return;
        }
        this.goToPage(this.pageCount - 1);
    }

    goToPrev() {
        if (this.activePage === 0) {
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

    hasPrev() {
        return this.activePage > 0;
    }

    hasNext() {
        return this.activePage < this.pageCount - 1;
    }

    goToPage(pageIndex:number) {
        this.activePage = pageIndex;
        var firstIndex = pageIndex * this.pageSize;
        var pageSize = Math.min(this.pageSize, this.totalCount- firstIndex);
        this.buildPagesLinksArray();

        var pageChange: PageChangeEvent = new PageChangeEvent();
        pageChange.firstIndex = firstIndex;
        pageChange.pageIndex = pageIndex;
        pageChange.pageSize = pageSize;

        this.pageChange.next(pageChange);
    }

}
