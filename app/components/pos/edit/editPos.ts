/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES, ChangeDetectionStrategy, EventEmitter, OnInit} from 'angular2/angular2';

import {Pos} from '../../../client/domain/pos';

import {Language, LocaleTexts, LanguageFactory, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';

import {LangSelect} from '../../lang/langSelect/langSelect';
import {LocalizedDirective} from '../../utils/localizedInput';
import {RequiredValidator} from '../../utils/validators';
import {FormMessage} from '../../utils/formMessage/formMessage';

import {List} from 'immutable';

@Component({
    selector: 'posEditComponent',
    inputs: ['pos'],
    outputs: ['saved', 'cancelled']
})
@View({
    templateUrl: './components/pos/edit/editPos.html',
    styleUrls: ['./components/pos/edit/editPos.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelect, LocalizedDirective,
        RequiredValidator, FormMessage]
})
export class PossEditComponent implements OnInit {
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;

    pos:Pos;
    posModel:any;

    editLanguage:Language;
    appLanguage:Language;

    saved = new EventEmitter();
    cancelled = new EventEmitter();

    constructor(posService:PosService, authService:AuthService, errorService:ErrorService) {
        this.posService = posService;
        this.authService = authService;
        this.errorService = errorService;
        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLanguage = language;
    }

    onInit() {
        this.posModel = this.pos;
    }


    private savePos(pos:Pos):Promise<Pos> {
        return this.posService.save(pos)
            .then((pos:Pos)=> {
                this.pos = pos;
                this.posModel = pos;
                return pos;
            });
    }

    onFormSubmit() {
        this.savePos(this.pos)
            .then((pos)=> {
                this.saved.next(pos);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.next(null);
    }

}
