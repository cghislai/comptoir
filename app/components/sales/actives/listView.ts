/**
 * Created by cghislai on 31/07/15.
 */
import {Component, View, NgFor, formDirectives} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {ApplicationService} from 'services/application';
import {Command, CommandSearch, CommandService} from 'services/commandService';
import {Pagination, Locale} from 'services/utils';
import {Paginator} from 'components/utils/paginator/paginator';

@Component({
    selector: "activeSalesList"
})

@View({
    templateUrl: './components/sales/actives/listView.html',
    styleUrls: ['./components/sales/actives/listView.css'],
    directives: [NgFor, Paginator, formDirectives]
})

export class ActiveSalesListView {
    commandService:CommandService;
    router:Router;
    appLocale: Locale;

    commandSearch:CommandSearch;
    commands:Command[];
    commandsCount:number;
    commandsPerPage:number = 25;

    loading:boolean;


    constructor(commandService:CommandService, applicationService: ApplicationService, router:Router) {
        this.commandService = commandService;
        this.router = router;
        this.commandSearch = new CommandSearch();
        this.commandSearch.pagination = new Pagination(0, this.commandsPerPage);
        this.commandSearch.active = true;
        this.appLocale = applicationService.locale;
        this.searchCommands();
    }

    searchCommands() {
        // TODO: cancel existing promises;
        this.loading = true;
        var thisView = this;
        this.commandService
            .searchCommands(this.commandSearch)
            .then(function (result) {
                thisView.commandsCount = result.totalCount;
                thisView.commands = result.results;
                thisView.loading = false;
            });
    }

    onPageChanged(pagination:Pagination) {
        this.commandSearch.pagination = pagination;
        this.searchCommands();
    }

    doSwitchToCommand(command:Command) {
        var id = command.id;
        var url = '/sales/sale/' + id;
        this.router.navigate(url);
    }

    doRemoveCommand(command:Command) {
        var thisView = this;
        this.commandService.removeCommand(command)
            .then(function (result) {
                thisView.searchCommands();
            });
    }

}