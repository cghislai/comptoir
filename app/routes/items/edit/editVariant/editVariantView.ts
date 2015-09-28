/**
 * Created by cghislai on 05/08/15.
 */
import {Component, View, NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/angular2';
import {RouteParams, Router, RouterLink} from 'angular2/router';

import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalAttributeValue, LocalAttributeValueFactory} from 'client/localDomain/attributeValue';
import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {LocalItem} from 'client/localDomain/item';
import {AttributeDefinition, AttributeDefinitionSearch} from 'client/domain/attributeDefinition';
import {ItemVariant, Pricing} from 'client/domain/itemVariant';
import {Language, LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {NumberUtils} from 'client/utils/number';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {ItemService} from 'services/item';
import {ItemVariantService} from 'services/itemVariant';
import {AttributeDefinitionService} from 'services/attributeDefinition';
import {AttributeValueService} from 'services/attributeValue';
import {ErrorService} from 'services/error';
import {AuthService} from 'services/auth';

import {LangSelect} from 'components/lang/langSelect/langSelect';
import {FormMessage} from 'components/utils/formMessage/formMessage';
import {RequiredValidator} from 'components/utils/validators';
import {LocalizedDirective} from 'components/utils/localizedInput';

import {Map} from 'immutable';

@Component({
    selector: 'editItemVariant'
})
@View({
    templateUrl: './routes/items/edit/editVariant/editVariantView.html',
    styleUrls: ['./routes/items/edit/editVariant/editVariantView.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, RouterLink, LangSelect, LocalizedDirective, FormMessage, RequiredValidator]
})
export class ItemVariantEditView {
    itemService:ItemService;
    itemVariantService:ItemVariantService;
    attributeValueService:AttributeValueService;
    attributeDefinitionService:AttributeDefinitionService;
    errorService:ErrorService;
    authService:AuthService;
    router:Router;

    item:LocalItem;
    itemVariant:LocalItemVariant;
    newAttributeValue:LocalAttributeValue;
    attributesToAdd:LocalAttributeValue[];
    allVariantAttributes:LocalAttributeValue[];

    pricingAmountRequired:boolean;

    appLocale:string;
    editLanguage:Language;
    allPricings:Pricing[];

    constructor(itemVariantService:ItemVariantService, itemService:ItemService, attributeDefinitionService:AttributeDefinitionService,
                errorService:ErrorService, authService:AuthService, attributeValueService:AttributeValueService,
                routeParams:RouteParams, router:Router) {
        this.router = router;
        this.itemService = itemService;
        this.itemVariantService = itemVariantService;
        this.attributeDefinitionService = attributeDefinitionService;
        this.attributeValueService = attributeValueService;
        this.errorService = errorService;
        this.authService = authService;

        this.appLocale = authService.getEmployeeLanguage().locale;
        this.editLanguage = authService.getEmployeeLanguage();
        this.allPricings = [
            Pricing.ABSOLUTE,
            Pricing.ADD_TO_BASE,
            Pricing.PARENT_ITEM
        ];
        this.attributesToAdd = [];
        this.allVariantAttributes = [];

        this.resetNewAttributeValue();
        this.findItem(routeParams).then(()=> {
            this.findItemVariant(routeParams);
        });
    }

    findItem(routeParams:RouteParams):Promise<any> {
        if (routeParams == null || routeParams.params == null) {
            throw 'no route params';
        }
        var idParam = routeParams.get('itemId');
        var idNumber = parseInt(idParam);
        if (isNaN(idNumber)) {
            throw 'invalid item id param';
        }
        return this.getItem(idNumber);
    }

    getItem(id:number):Promise<any> {
        return this.itemService.get(id)
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
        var itemVariantDesc:any = {};
        itemVariantDesc.attributeValues = [];
        itemVariantDesc.pricing = Pricing.PARENT_ITEM;
        itemVariantDesc.item = this.item;
        itemVariantDesc.pricingAmount = 0;
        this.allVariantAttributes = [];
        this.itemVariant = <LocalItemVariant>Map(itemVariantDesc);
        this.checkPricingAmountRequired();
    }

    getItemVariant(id:number) {
        this.itemVariantService.get(id)
            .then((itemVariant:LocalItemVariant)=> {
                this.itemVariant = itemVariant;
                this.fillAllVariantsAttribute();
                this.checkPricingAmountRequired();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    public doSaveItemVariant() {
        this.itemVariantService.save(this.itemVariant)
            .then((itemVariant) => {
                var newAttributeTask = [];
                for (var attribute of this.attributesToAdd) {
                    newAttributeTask.push(this.doSaveAttribute(attribute));
                }
                return Promise.all(newAttributeTask);
            }).then(()=> {
                this.attributesToAdd = [];
                this.allVariantAttributes = this.itemVariant.attributeValues;
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
                var picDesc = {
                    dataURI: data
                };

                var mainPicture:LocalPicture = <LocalPicture> Map(picDesc);
                if (thisView.itemVariant.mainPicture != null) {
                    mainPicture = <LocalPicture>thisView.itemVariant.mainPicture.merge(mainPicture);
                }
                thisView.itemVariant = <LocalItemVariant>
                    thisView.itemVariant.set('mainPicture', mainPicture);
            });
    }

    getPricingLabel(pricing:Pricing) {
        return LocalItemVariantFactory.getPricingLabel(pricing);
    }

    onPricingChanged() {
        this.checkPricingAmountRequired();
    }

    setItemVariantPricingAmount(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        valueNumber = NumberUtils.toFixedDecimals(valueNumber, 2);
        this.itemVariant.pricingAmount = valueNumber;
    }

    checkPricingAmountRequired() {
        var required = true;
        switch (this.itemVariant.pricing) {
            case Pricing.PARENT_ITEM:
            {
                required = false;
                break;
            }
        }
        this.pricingAmountRequired = required;
    }

    doAddAttribute() {
        var attributeToAdd = this.newAttributeValue;
        if (this.itemVariant.id != null) {
            this.doSaveAttribute(attributeToAdd);
        } else {
            this.attributesToAdd.push(attributeToAdd);
            this.allVariantAttributes.push(attributeToAdd);
        }
        this.resetNewAttributeValue();
    }

    private doSaveAttribute(attributeToAdd:LocalAttributeValue) {

        var defName = attributeToAdd.attributeDefinition.name[this.editLanguage.locale];
        var attributeDefRequest = new SearchRequest<AttributeDefinition>();
        var search = new AttributeDefinitionSearch();
        search.companyRef = this.authService.getEmployeeCompanyRef();
        search.nameContains = defName;
        attributeDefRequest.search = search;

        return this.attributeDefinitionService.search(attributeDefRequest)
            .then((result:SearchResult<AttributeDefinition>) => {
                if (result.list.count() > 0) {
                    var def = result.list[0];
                    return def;
                }
                attributeToAdd.attributeDefinition.companyRef = this.authService.getEmployeeCompanyRef();
                return this.attributeDefinitionService.save(attributeToAdd.attributeDefinition)
                    .then((ref)=> {
                        attributeToAdd.attributeDefinition.id = ref.id;
                        return attributeToAdd.attributeDefinition;
                    });
            }).then((attributeDefinition)=> {
                attributeToAdd.attributeDefinition = attributeDefinition;
                return this.attributeValueService.save(attributeToAdd);
            }).then(()=> {
                this.itemVariant.attributeValues.push(attributeToAdd);
                return this.itemVariantService.save(this.itemVariant)
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    doRemoveAttribute(attr:LocalAttributeValue) {
        var addedAttributesCopy = [];
        var attrFound = false;
        for (var addedAttribute of this.attributesToAdd) {
            if (addedAttribute == attr) {
                attrFound = true;
                continue;
            }
            addedAttributesCopy.push(addedAttribute);
        }
        if (attrFound) {
            this.attributesToAdd = addedAttributesCopy;
            this.fillAllVariantsAttribute();
            return;
        }

        var itemAttributesCopy = [];
        for (var existingAttribute of this.itemVariant.attributeValues) {
            if (existingAttribute == attr) {
                attrFound = true;
                continue;
            }
            itemAttributesCopy.push(existingAttribute);
        }
        if (attrFound) {
            this.itemVariant.attributeValues = itemAttributesCopy;
            this.fillAllVariantsAttribute();
            this.itemVariantService.save(this.itemVariant)
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
            return;
        }
    }

    private fillAllVariantsAttribute() {
        var attributeList = [];
        for (var itemAttr of this.itemVariant.attributeValues) {
            attributeList.push(itemAttr);
        }
        for (var itemAttr of this.attributesToAdd) {
            attributeList.push(itemAttr);
        }
        this.allVariantAttributes = attributeList;
    }


    resetNewAttributeValue() {
        var attributeDefinition = new AttributeDefinition();
        attributeDefinition.name = LocaleTextsFactory.toLocaleTexts({});
        this.newAttributeValue = <LocalAttributeValue>Map({
            value: LocaleTextsFactory.toLocaleTexts({}),
            attributeDefinition: attributeDefinition
        });
    }
}
