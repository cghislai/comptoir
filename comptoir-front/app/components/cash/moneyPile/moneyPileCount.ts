/**
 * Created by cghislai on 29/09/15.
 */
import {Component, View, EventEmitter, ChangeDetectionStrategy} from 'angular2/angular2';

import {LocalMoneyPile, CashType,  NewMoneyPile} from 'client/localDomain/moneyPile';

import {NumberUtils} from 'client/utils/number';
import {Language} from 'client/utils/lang';

import {AuthService} from 'services/auth';

import {FastInput} from 'components/utils/fastInput'


@Component({
    selector: 'moneyPileCount',
    properties: ['moneyPile'],
    events: ['changed'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@View({
    templateUrl: './components/cash/moneyPile/moneyPileCount.html',
    styleUrls: ['./components/cash/moneyPile/moneyPileCount.css'],
    directives: [FastInput]
})
export class MoneyPileCountComponent {
    moneyPile:LocalMoneyPile;
    appLanguage:Language;
    changed = new EventEmitter();

    constructor(authService:AuthService) {
        this.appLanguage = authService.getEmployeeLanguage();
    }

    onMoneyPileChanged(newCount) {
        newCount = parseInt(newCount);
        if (isNaN(newCount) || newCount <= 0) {
            return;
        }
        var moneyPileJS = this.moneyPile.toJS();
        moneyPileJS.unitCount = newCount;
        var newMoneyPile = NewMoneyPile(moneyPileJS);
        this.changed.next(newMoneyPile);
    }
}