/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, NgFor} from 'angular2/angular2';
import {Command, CommandSearch, CommandService} from 'services/commandService';
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

    commandService:CommandService;
    commandSearch:CommandSearch;
    commandsPerPage:number = 25;
    commandsCount:number;
    commands:Command[];

    constructor(commandsService:CommandService) {
        this.commandService = commandsService;
        this.commandSearch = new CommandSearch();
        this.commandSearch.active = false;
        this.commandSearch.pagination = new Pagination(0, this.commandsPerPage);
        this.searchCommands();
    }

    searchCommands() {
        var thisView = this;
        this.commandService.searchCommands(this.commandSearch)
            .then(function (result) {
                thisView.commandsCount = result.totalCount;
                thisView.commands = result.results;
            });
    }

    onPageChanged(pagination:Pagination) {
        this.commandSearch.pagination = pagination;
    }
}
