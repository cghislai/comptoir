/**
 * Created by cghislai on 29/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {CommandService} from 'services/commandService';

@Component({
    selector: 'commandView'
})

@View({
    templateUrl: './components/commandView/commandView.html',
    styleUrls: ['./components/commandView/commandView.css'],
    directives: [NgFor, NgIf]
})


export class CommandView {

    commandService: CommandService;

    constructor(commandService: CommandService) {
        this.commandService = commandService;
    }

}