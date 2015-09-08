/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf,
    FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalAttributeValue, LocalAttributeValueFactory} from 'client/localDomain/attributeValue';
import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalItem} from 'client/localDomain/item';
import {AttributeDefinition} from 'client/domain/attributeDefinition';

import {ItemVariant, Pricing} from 'client/domain/itemVariant';
import {Language, LocaleTexts} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';

import {ItemService} from 'services/item';
import {ItemVariantService} from 'services/itemVariant';
import {AttributeValueService} from 'services/attributeValue';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect, LocalizedDirective} from 'components/utils/langSelect/langSelect';
import {FormMessage} from 'components/utils/formMessage/formMessage';

@Component({
    selector: 'editItemVariant',
    viewBindings: [FormBuilder]
})
@View({
    templateUrl: './routes/items/edit/editVariant/editVariantView.html',
    styleUrls: ['./routes/items/edit/editVariant/editVariantView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective, FormMessage]
})
export class ItemVariantEditView {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    attributeValueService:AttributeValueService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    item:LocalItem;
    itemVariant:LocalItemVariant;
    itemVariantForm:ControlGroup;
    newAttributeForm:ControlGroup;
    newAttributeDefinitions:LocaleTexts;
    newAttributeValues:LocaleTexts;

    pricingAmountRequired:boolean;

    formBuilder:FormBuilder;

    appLocale:string;
    editLanguage:Language;
    allPricings:Pricing[];

    constructor(itemVariantService:ItemVariantService, itemService:ItemService,
                errorService:ErrorService, authService:AuthService, attributeValueService:AttributeValueService,
                routeParams:RouteParams, router:Router, formBuilder:FormBuilder) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.attributeValueService = attributeValueService;
        this.errorService = errorService;
        this.authService = authService;
        this.formBuilder = formBuilder;

        this.appLocale = authService.getEmployeeLanguage().locale;
        this.editLanguage = authService.getEmployeeLanguage();
        this.allPricings = [
            Pricing.ABSOLUTE,
            Pricing.ADD_TO_BASE,
            Pricing.PARENT_ITEM
        ];

        this.resetNewAttributeValue();
        this.findItem(routeParams);
        this.findItemVariant(routeParams);
    }

    buildForm() {
        this.itemVariantForm = this.formBuilder.group({
            'variantReference': [this.itemVariant.variantReference],
            'pricing': [this.itemVariant.pricing],
            'pricingAmount': [this.itemVariant.pricingAmount]
        });
    }

    findItem(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            throw 'no route params'
            return;
        }
        var idParam = routeParams.get('itemId');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            throw 'invalid item id param';
        }
        this.getItem(idNumber);
    }

    getItem(id:number) {
        this.itemService.get(id)
            .then((item)=> {
                this.item = item;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    findItemVariant(routeParams:RouteParams) {
        if (routeParams == null || routeParams.params == null) {
            this.getNewItemVariant();
            return;
        }
        var idParam = routeParams.get('variantId');
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
        this.itemVariant.attributeValues = [];
        this.itemVariant.pricing = Pricing.PARENT_ITEM;
        this.buildForm();
    }

    getItemVariant(id:number) {
        this.itemVariantService.get(id)
            .then((itemVariant:LocalItemVariant)=> {
                this.itemVariant = itemVariant;
                this.buildForm();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItemVariant() {
        var pricingString = this.itemVariantForm.value.pricing;
        var pricingInt = parseInt(pricingString);
        this.itemVariant.pricing = pricingInt;
        var pricingAmountString = this.itemVariantForm.value.pricingAmount;
        var pricingAmount = NumberUtils.toFixedDecimals(parseFloat(pricingAmountString), 2);
        this.itemVariant.pricingAmount = pricingAmount;
        this.itemVariant.variantReference = this.itemVariantForm.value.variantReference;
        this.itemVariant.item = this.item;

        this.itemVariantService.save(this.itemVariant)
            .then(() => {
                this.router.navigate('/items/edit/' + this.item.id);
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

    getPricingLabel(pricing:Pricing) {
        return LocalItemVariantFactory.getPricingLabel(pricing);
    }

    onPricingChanged() {
        this.checkPricingAmountRequired();
    }

    checkPricingAmountRequired() {
        var pricingInt:number = parseInt(this.itemVariantForm.value.pricing);
        var required = true;
        switch (pricingInt) {
            case Pricing.PARENT_ITEM:
            {
                required = false;
                break;
            }
        }
        this.pricingAmountRequired = required;
    }

    getPricingTotalAmount():number {
        if (this.itemVariantForm == null) {
            return null;
        }
        var pricingInt:number = parseInt(this.itemVariantForm.value.pricing);
        var pricingAmount:number = parseFloat(this.itemVariantForm.value.pricingAmount);
        if (isNaN(pricingAmount)) {
            pricingAmount = 0;
        }
        var total:number = 0;
        switch (pricingInt) {
            case Pricing.ABSOLUTE:
            {
                total = pricingAmount;
                break;
            }
            case Pricing.ADD_TO_BASE:
            {
                var itemPrice:number = this.item.vatExclusive;
                total = itemPrice + pricingAmount;
                break;
            }
            case Pricing.PARENT_ITEM:
            {
                total = this.item.vatExclusive;
                break;
            }
        }
        return total;
    }

    doAddAttribute() {
        var newAttribute = new LocalAttributeValue();
        newAttribute.attributeDefinition = new AttributeDefinition();
        newAttribute.attributeDefinition.name = this.newAttributeDefinitions;
        newAttribute.value = this.newAttributeValues;

        this.attributeValueService.save(newAttribute)
            .then((attributeValue)=> {
                this.itemVariant.attributeValues.push(newAttribute);
                this.resetNewAttributeValue();
                return this.itemVariantService.save(this.itemVariant)
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doRemoveAttribute(attr:LocalAttributeValue) {
        var newAttributes = [];
        for (var existingAttribute of this.itemVariant.attributeValues) {
            if (existingAttribute == attr) {
                continue;
            }
            newAttributes.push(existingAttribute);
        }
        this.itemVariant.attributeValues = newAttributes;

        this.attributeValueService.remove(attr)
            .then(()=> {
                return this.itemVariantService.save(this.itemVariant);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    resetNewAttributeValue() {
        this.newAttributeForm = this.formBuilder.group({
            'definition': [''],
            'value': ['']
        });
        this.newAttributeDefinitions = new LocaleTexts();
        this.newAttributeValues = new LocaleTexts();
    }
}
