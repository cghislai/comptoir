/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf,
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalItemVariant} from 'client/localDomain/itemVariant';

import {ItemVariant} from 'client/domain/itemVariant';
import {Language, LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {ItemVariantService} from 'services/itemVariant';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';


@Component({
    selector: 'editItemVariant'
})
@View({
    templateUrl: './routes/itemVariants/edit/editView.html',
    styleUrls: ['./routes/itemVariants/edit/editView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective]
})
export class ItemVariantsEdiView {
    itemVariantService:ItemVariantService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    itemVariant:LocalItemVariant;
    itemVariantForm:ControlGroup;
    appLocale:string;
    editLanguage:Language;
    allLanguages:Language[];

    itemVariantFormDefinition = {
        'pictureBlob': [null],
        'name': [''],
        'description': [''],
        'reference': [''],
        'vatExclusive': [0],
        'vatPercentage': [0]
    };


    constructor(itemVariantService:ItemVariantService, errorService:ErrorService, authService:AuthService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemVariantService = itemVariantService;
        this.errorService = errorService;
        this.authService = authService;
        this.appLocale = authService.getEmployeeLanguage().locale;
        this.editLanguage = authService.getEmployeeLanguage();

        this.findItemVariant(routeParams);
    }

    findItemVariant(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItemVariant();
            return;
        }
        var idParam = routeParams.get('id');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            if (idParam == 'new') {
                this.getNewItemVariant();
                return;
            }
            this.getNewItemVariant();
            return;
        }
        this.getItemVariant(idNumber);
    }

    getNewItemVariant() {
        this.itemVariant = new LocalItemVariant();
    }

    getItemVariant(id:number) {
        this.itemVariantService.getLocalItemVariantAsync(id)
            .then((itemVariant:LocalItemVariant)=> {
                this.itemVariant = itemVariant;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItemVariant() {
        this.itemVariantService.saveLocalItemVariantAsync(this.itemVariant)
            .then(() => {
                this.router.navigate('/itemVariants/list');
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length != 1) {
            return;
        }
        var file = files[0];
        var thisView = this;

        new Promise<string>((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                resolve(data);
            };
            reader.readAsDataURL(file);
        }).then((data:string)=> {
                if (thisView.itemVariant.mainPicture == null) {
                    thisView.itemVariant.mainPicture = new LocalPicture();
                }
                thisView.itemVariant.mainPicture.dataURI = data;
            });
    }



}
