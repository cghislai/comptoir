/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, NgFor} from 'angular2/angular2';
import {Command, CommandSearch, CommandService} from 'services/commandService';
import {Pagination} from 'services/utils';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: 'historyCommandsView',
    viewInjector: [CommandService]
})
@View({
    templateUrl: './components/history/commands/historyCommandsView.html',
    styleUrls: ['./components/history/commands/historyCommandsView.css'],
    directives: [Paginator, NgFor]
})
export class HistoryCommandsView {

    commandService:CommandService;
    commandSearch:CommandSearch;
    itemsPerPage:number = 25;

    constructor(commandsService:CommandService) {
        this.commandService = commandsService;
        this.commandSearch = new CommandSearch();
        this.commandSearch.pagination = new Pagination(0, this.itemsPerPage);
        this.searchCommands();
    }

    searchCommands() {
        this.commandService.findCommands(this.commandSearch);
    }

    onPageChanged(pagination:Pagination) {
        this.commandSearch.pagination = pagination;
    }
}
