/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, NgFor} from 'angular2/angular2';
import {Command, CommandSearch, SaleService} from 'services/saleService';
import {Pagination} from 'services/utils';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: 'historyView'
})
@View({
    templateUrl: './components/sales/history/historyView.html',
    styleUrls: ['./components/sales/history/historyView.css'],
    directives: [Paginator, NgFor]
})
export class HistoryView {

    saleService:SaleService;
    commandSearch:CommandSearch;
    commandsPerPage:number = 25;
    commandsCount:number;
    commands:Command[];

    constructor(saleService:SaleService) {
        this.saleService = saleService;
        this.commandSearch = new CommandSearch();
        this.commandSearch.active = false;
        this.commandSearch.pagination = new Pagination(0, this.commandsPerPage);
        this.searchCommands();
    }

    searchCommands() {
        var thisView = this;
        this.saleService.searchCommands(this.commandSearch)
            .then(function (result) {
                thisView.commandsCount = result.count;
                thisView.commands = result.list;
            });
    }

    onPageChanged(pagination:Pagination) {
        this.commandSearch.pagination = pagination;
    }
}
