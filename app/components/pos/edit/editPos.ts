/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit} from 'angular2/core';
import {NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/common';

import {LocalPos, LocalPosFactory} from '../../../client/localDomain/pos';
import {PosRef} from '../../../client/domain/pos';

import {Language} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';
import {PosService} from '../../../services/pos';
import {ErrorService} from '../../../services/error';

import {LangSelect} from '../../lang/langSelect/langSelect';
import {LocalizedDirective} from '../../utils/localizedInput';
import {RequiredValidator} from '../../utils/validators';
import {FormMessage} from '../../utils/formMessage/formMessage';


@Component({
    selector: 'pos-edit-component',
    inputs: ['pos'],
    outputs: ['saved', 'cancelled'],
    templateUrl: './components/pos/edit/editPos.html',
    styleUrls: ['./components/pos/edit/editPos.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelect, LocalizedDirective,
        RequiredValidator, FormMessage]
})
export class PossEditComponent implements OnInit {
    posService:PosService;
    errorService:ErrorService;
    authService:AuthService;

    pos:LocalPos;
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

    ngOnInit() {
        this.posModel = this.pos;
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


    private savePos(pos:LocalPos):Promise<LocalPos> {
        return this.posService.save(pos)
            .then((ref:PosRef)=> {
                return this.posService.get(ref.id);
            })
            .then((pos:LocalPos)=> {
                this.pos = pos;
                this.posModel = pos.toJS();
                return pos;
            });
    }

}
