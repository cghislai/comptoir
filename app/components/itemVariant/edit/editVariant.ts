/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit, ChangeDetectionStrategy} from 'angular2/core';
import {NgFor, NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {RouterLink} from 'angular2/router';

import {LocalPicture,  LocalPictureFactory} from '../../../client/localDomain/picture';
import {LocalAttributeValue, LocalAttributeValueFactory} from '../../../client/localDomain/attributeValue';
import {LocalItemVariant, LocalItemVariantFactory} from '../../../client/localDomain/itemVariant';
import {LocalAttributeDefinition, LocalAttributeDefinitionFactory} from '../../../client/localDomain/attributeDefinition';
import {Pricing} from '../../../client/domain/itemVariant';
import {AttributeDefinitionSearch} from '../../../client/domain/attributeDefinition';
import {Language, LocaleTextsFactory} from '../../../client/utils/lang';
import {NumberUtils} from '../../../client/utils/number';
import {SearchRequest, SearchResult} from '../../../client/utils/search';

import {ItemVariantService} from '../../../services/itemVariant';
import {AttributeDefinitionService} from '../../../services/attributeDefinition';
import {AttributeValueService} from '../../../services/attributeValue';
import {PictureService} from '../../../services/picture';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';

import {LangSelect} from '../../lang/langSelect/langSelect';
import {FormMessage} from '../../utils/formMessage/formMessage';
import {RequiredValidator} from '../../utils/validators';
import {LocalizedDirective} from '../../utils/localizedInput';

import * as Immutable from 'immutable';

@Component({
    selector: 'edit-item-variant-component',
    inputs: ['itemVariant'],
    outputs: ['saved', 'cancelled'],
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/itemVariant/edit/editVariant.html',
    styleUrls: ['./components/itemVariant/edit/editVariant.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES,
        RouterLink, LangSelect, LocalizedDirective, FormMessage,
        RequiredValidator]
})
export class ItemVariantEditComponent implements OnInit {
    itemVariantService:ItemVariantService;
    attributeValueService:AttributeValueService;
    attributeDefinitionService:AttributeDefinitionService;
    pictureService:PictureService;
    errorService:ErrorService;
    authService:AuthService;

    itemVariant:LocalItemVariant;
    itemVariantModel:any;
    picture:LocalPicture;

    newAttributeValue:LocalAttributeValue;
    unsavedAttributes:Immutable.List<LocalAttributeValue>;

    allPricings:Immutable.List<Pricing>;
    pricingAmountRequired:boolean;
    pictureTouched:boolean;

    appLanguage:Language;
    editLanguage:Language;

    saved = new EventEmitter();
    cancelled = new EventEmitter();

    constructor(itemVariantService:ItemVariantService, attributeDefinitionService:AttributeDefinitionService,
                pictureService:PictureService,
                errorService:ErrorService, authService:AuthService, attributeValueService:AttributeValueService) {
        this.itemVariantService = itemVariantService;
        this.attributeDefinitionService = attributeDefinitionService;
        this.attributeValueService = attributeValueService;
        this.pictureService = pictureService;
        this.errorService = errorService;
        this.authService = authService;

        this.appLanguage = authService.getEmployeeLanguage();
        this.editLanguage = authService.getEmployeeLanguage();
        this.allPricings = Immutable.List([
            Pricing.ABSOLUTE,
            Pricing.ADD_TO_BASE,
            Pricing.PARENT_ITEM
        ]);
        this.unsavedAttributes = Immutable.List([]);

        this.resetNewAttributeValue();
    }

    ngOnInit() {
        this.itemVariantModel = this.itemVariant.toJS();
        this.picture = this.itemVariant.mainPicture;
        this.checkPricingAmountRequired();
    }

    getItemVariantTotalPrice() {
        var itemVariant = LocalItemVariantFactory.createNewItemVariant(this.itemVariantModel);
        return LocalItemVariantFactory.calcPrice(itemVariant, true);
    }


    getPricingLabel(pricing:Pricing) {
        return LocalItemVariantFactory.getPricingLabel(pricing).get(this.appLanguage.locale);
    }


    public onFormSubmit() {
        var itemVariant = LocalItemVariantFactory.createNewItemVariant(this.itemVariantModel);
        this.saveItemVariant(itemVariant)
            .then((itemVariant)=> {
                this.saved.next(itemVariant);
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        ;
    }

    // TODO: add warning for pending changes
    public onCancelClicked() {
        this.cancelled.next(null);
    }

    onPictureFileSelected(event) {
        var files = event.target.files;
        if (files.length !== 1) {
            return;
        }
        var file = files[0];
        new Promise<string>((resolve, reject)=> {
            var reader = new FileReader();
            reader.onload = function () {
                var data = reader.result;
                resolve(data);
            };
            reader.readAsDataURL(file);
        }).then((data:string)=> {
                var mainPicture:LocalPicture;
                var currentPicture = this.itemVariant.mainPicture;
                if (currentPicture == null) {
                    var picDesc = {
                        dataURI: data,
                        company: this.authService.getEmployeeCompany()
                    };
                    mainPicture = LocalPictureFactory.createNewPicture(picDesc);
                } else {
                    mainPicture = <LocalPicture>currentPicture.set('dataURI', data);
                }
                this.itemVariantModel.mainPicture = mainPicture.toJS();
                this.picture = mainPicture;
                this.pictureTouched = true;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPricingChanged(event) {
        var pricing:Pricing = <Pricing>parseInt(event.target.value);
        this.itemVariantModel.pricing = pricing;
        this.checkPricingAmountRequired();
    }

    setPricingAmount(event) {
        var valueString = event.target.value;
        var valueNumber:number = parseFloat(valueString);
        if (isNaN(valueNumber)) {
            return;
        }
        valueNumber = NumberUtils.toFixedDecimals(valueNumber, 2);
        this.itemVariantModel.pricingAmount = valueNumber;
    }

    checkPricingAmountRequired() {
        var required = true;
        if (this.itemVariantModel.pricing === Pricing.PARENT_ITEM) {
            required = false;
        }
        this.pricingAmountRequired = required;
    }

    doAddAttribute() {
        var attributeToAdd = this.newAttributeValue;
        if (this.itemVariantModel.id != null) {
            this.saveAttributeValue(attributeToAdd)
                .then((attributeValue)=> {
                    var curAttributes = this.itemVariant.attributeValues;
                    curAttributes.push(attributeValue);
                    var itemVariant = <LocalItemVariant>LocalItemVariantFactory.createNewItemVariant(this.itemVariantModel)
                        .set('attributeValues', curAttributes);
                    return this.saveItemVariant(itemVariant);
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        } else {
            this.unsavedAttributes = this.unsavedAttributes.push(attributeToAdd);
        }
        this.resetNewAttributeValue();
    }

    doRemoveAttribute(attributeValue:LocalAttributeValue) {
        var attributeSaved = attributeValue.id != null;
        if (attributeSaved) {
            var newAttributes = Immutable.List(this.itemVariantModel.attributeValues)
                .filter((existingAttribute:LocalAttributeValue)=> {
                    return existingAttribute.id !== attributeValue.id;
                }).toArray();
            var itemVariant = <LocalItemVariant>LocalItemVariantFactory.createNewItemVariant(this.itemVariantModel).set('attributeValues', newAttributes);
            return this.saveItemVariant(itemVariant)
                .then((itemVariant)=> {
                    // TODO: remove?
                    // return this.attributeValueService.remove(attributeValue);
                })
                .catch((error)=> {
                    this.errorService.handleRequestError(error);
                });
        } else {
            var newUnsavedAttributes = this.unsavedAttributes
                .filter((attribute)=> {
                    return !Immutable.is(attribute, attributeValue);
                }).toList();
            this.unsavedAttributes = newUnsavedAttributes;
        }
    }

    resetNewAttributeValue() {
        var attributeDefinition:any = {};
        attributeDefinition.name = LocaleTextsFactory.toLocaleTexts({});
        var localAttributedefinition = LocalAttributeDefinitionFactory.createAttributeDefinition(attributeDefinition);
        this.newAttributeValue = LocalAttributeValueFactory.createAttributeValue({
            value: LocaleTextsFactory.toLocaleTexts({}),
            attributeDefinition: localAttributedefinition
        });
    }


    private saveItemVariant(itemVariant:LocalItemVariant):Promise<LocalItemVariant> {
        if (this.pictureTouched) {
            var picture = LocalPictureFactory.createNewPicture(this.itemVariantModel.mainPicture);
            return this.pictureService.save(picture)
                .then((localPic:LocalPicture)=> {
                    this.pictureTouched = false;
                    itemVariant = <LocalItemVariant>itemVariant.set('mainPicture', localPic);
                    return this.saveItemVariant(itemVariant);
                });
        }
        return this.itemVariantService.save(itemVariant)
            .then((ref)=> {
                return this.itemVariantService.get(ref.id);
            })
            .then((itemVariant:LocalItemVariant) => {
                this.itemVariant = itemVariant;
                this.itemVariantModel = itemVariant.toJS();

                if (this.unsavedAttributes.size > 0) {
                    var newAttributeTask = [];
                    this.unsavedAttributes.forEach((attribute)=> {
                        newAttributeTask.push(this.saveAttributeValue(attribute));
                    });
                    return Promise.all(newAttributeTask)
                        .then((results:LocalAttributeValue[])=> {
                            this.unsavedAttributes = Immutable.List([]);
                            var allAttributes = this.itemVariant.attributeValues;
                            for (var savedValue of results) {
                                allAttributes.push(savedValue);
                            }
                            var newItemVariant = <LocalItemVariant>this.itemVariant.set('attributeValues', allAttributes);
                            return this.itemVariantService.save(newItemVariant);
                        })
                        .then((ref)=> {
                            return this.itemVariantService.get(ref.id);
                        })
                        .then((itemVariant)=> {
                            this.itemVariant = itemVariant;
                            this.itemVariantModel = itemVariant.toJS();
                            if (this.itemVariant.mainPicture != null) {
                                this.picture = this.itemVariant.mainPicture;
                            }
                            return itemVariant;
                        });
                } else {
                    return itemVariant;
                }
            });
    }

    private saveAttributeValue(attributevalue:LocalAttributeValue):Promise<LocalAttributeValue> {
        var attributeDefinitionName = attributevalue.attributeDefinition.name.get(this.editLanguage.locale);
        return this.searchAttributeDefinitionForName(attributeDefinitionName)
            .then((attributeDefinition)=> {
                if (attributeDefinition == null) {
                    var toSaveDefinitionJs:any = attributevalue.attributeDefinition.toJS();
                    toSaveDefinitionJs.company = this.authService.getEmployeeCompany();
                    var toSaveDefinition:LocalAttributeDefinition = LocalAttributeDefinitionFactory.createAttributeDefinition(toSaveDefinitionJs);
                    return this.saveAttributeDefinition(toSaveDefinition);
                } else {
                    return attributeDefinition;
                }
            })
            .then((attributeDefinition)=> {
                var updatedAttributeValue = <LocalAttributeValue>attributevalue
                    .set('attributeDefinition', attributeDefinition);
                return this.attributeValueService.save(updatedAttributeValue);
            })
            .then((ref)=> {
                return this.attributeValueService.get(ref.id);
            });
    }

    private saveAttributeDefinition(attributeDefinition:LocalAttributeDefinition):Promise<LocalAttributeDefinition> {
        return this.attributeDefinitionService.save(attributeDefinition)
            .then((ref)=> {
                return this.attributeDefinitionService.get(ref.id);
            });
    }

    private searchAttributeDefinitionForName(name:string):Promise<LocalAttributeDefinition> {
        var attributeDefRequest = new SearchRequest<LocalAttributeDefinition>();
        var search = new AttributeDefinitionSearch();
        search.companyRef = this.authService.getEmployeeCompanyRef();
        search.nameContains = name;
        attributeDefRequest.search = search;

        return this.attributeDefinitionService.search(attributeDefRequest)
            .then((result:SearchResult<LocalAttributeDefinition>) => {
                if (result.list.size === 0) {
                    return null;
                }
                return result.list.first();
            });
    }

}
