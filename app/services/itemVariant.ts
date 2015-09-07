/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {AttributeDefinitionClient, AttributeDefinition, AttributeDefinitionFactory} from 'client/domain/attributeDefinition';
import {AttributeValueClient, AttributeValue, AttributeValueRef, AttributeValueFactory} from 'client/domain/attributeValue';
import {ItemVariantClient, ItemVariant, ItemVariantRef, ItemVariantSearch, ItemVariantFactory} from 'client/domain/itemVariant';
import {ItemClient, Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {PictureClient, Picture, PictureRef, PictureFactory} from 'client/domain/picture';

import {LocalItem, LocalItemFactory}from 'client/localDomain/item';
import {LocalAttributeValue,  LocalItemVariant, LocalItemVariantFactory}from 'client/localDomain/itemVariant';
import {LocalPicture, LocalPictureFactory}from 'client/localDomain/picture';

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
import {ComptoirResponse} from'client/utils/request';

import {AuthService} from 'services/auth';


export class ItemVariantService {
    private authService:AuthService;
    private itemClient:ItemClient;
    private itemVariantClient:ItemVariantClient;
    private pictureClient:PictureClient;
    private attributeDefinitionClient:AttributeDefinitionClient;
    private attributeValueClient:AttributeValueClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.itemClient = new ItemClient();
        this.itemVariantClient = new ItemVariantClient();
        this.pictureClient = new PictureClient();
        this.attributeDefinitionClient = new AttributeDefinitionClient();
        this.attributeValueClient = new AttributeValueClient();
    }


    public createItemVariant(itemVariant:ItemVariant):Promise<ItemVariantRef> {
        var authToken = this.authService.authToken;
        return this.itemVariantClient.create(itemVariant, authToken);
    }

    public updateItemVariant(itemVariant:ItemVariant):Promise<ItemVariantRef> {
        var authToken = this.authService.authToken;
        return this.itemVariantClient.update(itemVariant, authToken);
    }

    public getItemVariant(id:number):Promise<ItemVariant> {
        var authToken = this.authService.authToken;
        return this.itemVariantClient.get(id, authToken);
    }

    public searchItemsVariant(itemVariantSearch:ItemVariantSearch, pagination:Pagination):Promise<SearchResult<ItemVariant>> {
        if (itemVariantSearch.itemSearch == null) {
            itemVariantSearch.itemSearch = new ItemSearch();
        }
        itemVariantSearch.itemSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemVariantClient.search(itemVariantSearch, pagination, authToken);
    }


    // Local items

    public getLocalItemVariantAsync(id:number, refreshConf?:any):Promise<LocalItemVariant> {
        var localItemVariant = new LocalItemVariant();

        return this.getItemVariant(id)
            .then((itemVariant:ItemVariant)=> {
                return this.refreshLocalItemVariantAsync(localItemVariant, itemVariant, refreshConf);
            });
    }

    public refreshLocalItemVariantAsync(localItemVariant:LocalItemVariant, itemVariant:ItemVariant, conf?:any):Promise<LocalItemVariant> {
        LocalItemVariantFactory.updateLocalItemVariant(localItemVariant, itemVariant);
        var tasks = [];
        if (conf == null) {
            conf = {
                picture: true,
                itemPictureFallback: true,
                item: true,
                attributes: true,
            };
        }
        if (conf.picture) {
            if (itemVariant.mainPictureRef != null) {
                var pictureId = itemVariant.mainPictureRef.id;
                tasks.push(this.fetchLocalItemVariantPictureAsync(localItemVariant, pictureId));
            }
        }
        if (conf.item) {
            var itemId = itemVariant.itemRef.id;
            var itemrefreshConf = { picture: conf.itemPictureFallback};
            tasks.push(this.fetchLocalItemVariantItemAsync(localItemVariant, itemId, itemrefreshConf));
        }
        if (conf.attributes) {
            if (itemVariant.attributeValueRefs != null) {
                var attributesTasks = [];
                localItemVariant.attributeValues = [];
                for (var attributeValueRef of itemVariant.attributeValueRefs) {
                    attributesTasks.push(this.fetchLocalAttributeValueAsync(attributeValueRef.id)
                        .then((localValue)=> {
                            localItemVariant.attributeValues.push(localValue);
                        }));
                }
                var attributesTask = Promise.all(attributesTasks);
                tasks.push(attributesTask);
            }
        }
        return Promise.all(tasks)
            .then(()=> {
                return localItemVariant;
            });
    }


    private fetchLocalAttributeValueAsync(attributeDefinitionId:number):Promise<LocalAttributeValue> {
        var authToken = this.authService.authToken;
        return this.attributeValueClient.get(attributeDefinitionId, authToken)
            .then((attributeValue)=> {
                var localValue = LocalItemVariantFactory.toLocalAttributeValue(attributeValue);

                localValue.attributeDefinitionRequest = this.attributeDefinitionClient.getGetRequest(attributeValue.attributeDefinitionRef.id, authToken);
                return localValue.attributeDefinitionRequest.run()
                    .then((response:ComptoirResponse)=> {
                        var attributeDefinition = JSON.parse(response.text, AttributeDefinitionFactory.fromJSONAttributeDefinitionReviver);
                        localValue.attributeDefinition = attributeDefinition;
                        localValue.attributeDefinitionRequest = null;
                        return localValue;
                    });
            });
    }

    public saveLocalItemVariantAttribute(localAttribute:LocalAttributeValue):Promise<LocalAttributeValue> {
        var attributeDefinition = localAttribute.attributeDefinition;
        var definitionId = attributeDefinition.id;

        var authToken = this.authService.authToken;
        var createDefinitionTask = Promise.resolve(attributeDefinition);
        if (definitionId == null) {
            attributeDefinition.companyRef = this.authService.loggedEmployee.companyRef;
            createDefinitionTask = this.attributeDefinitionClient.create(attributeDefinition, authToken)
                .then((definitionRef)=> {
                    attributeDefinition.id = definitionRef.id;
                    definitionId = definitionRef.id;
                    return attributeDefinition;
                });
        }

        return createDefinitionTask.then(()=> {
            var valueId = localAttribute.id;
            var attributeValue = LocalItemVariantFactory.fromLocalAttributeValue(localAttribute);
            if (valueId == null) {
                return this.attributeValueClient.create(attributeValue, authToken)
                    .then((attributeRef)=> {
                        localAttribute.id = attributeRef.id;
                        return localAttribute;
                    });
            } else {
                return this.attributeValueClient.update(attributeValue, authToken)
                    .then((attributeRef)=> {
                        return localAttribute;
                    });
            }
        });
    }

    public saveLocalItemVariantAsync(localItemVariant:LocalItemVariant):Promise<LocalItemVariant> {
        var authToken = this.authService.authToken;

        return this.saveLocalItemVariantPictureAsync(localItemVariant)
            .then(()=> {
                var itemVariant = LocalItemVariantFactory.fromLocalItemVariant(localItemVariant);
                var itemVariantExists = itemVariant.id != null;
                if (itemVariantExists) {
                    return this.updateItemVariant(itemVariant)
                        .then(()=> {
                            return localItemVariant;
                        });
                } else {
                    return this.createItemVariant(itemVariant)
                        .then((itemVariantRef)=> {
                            localItemVariant.id = itemVariantRef.id;
                            return localItemVariant;
                        });
                }
            });
    }

    public searchLocalItemVariantsAsync(itemVariantSearch:ItemVariantSearch, pagination:Pagination, refreshConfig?:any):Promise<SearchResult<LocalItemVariant>> {
        return this.searchItemsVariant(itemVariantSearch, pagination)
            .then((result)=> {
                var localResult = new SearchResult<LocalItemVariant>();
                localResult.count = result.count;
                localResult.list = [];
                var taskList = [];
                for (var itemVariant of result.list) {
                    var localItemVariant = LocalItemVariantFactory.toLocalItemVariant(itemVariant);
                    localResult.list.push(localItemVariant);
                    taskList.push(this.refreshLocalItemVariantAsync(localItemVariant, itemVariant, refreshConfig));
                }
                Promise.all(taskList);
                return localResult;
            });
    }

    private saveLocalItemVariantPictureAsync(localItemVariant:LocalItemVariant):Promise<LocalItemVariant> {
        var localPicture = localItemVariant.mainPicture;
        if (localPicture == null) {
            return Promise.resolve(localItemVariant);
        }
        if (localItemVariant.mainPictureRequest != null) {
            localItemVariant.mainPictureRequest = null;
        }
        var authToken = this.authService.authToken;
        var pictureExists = localPicture.id != null;
        var picture = LocalPictureFactory.fromLocalPicture(localPicture);
        if (pictureExists) {
            localItemVariant.mainPictureRequest = this.pictureClient.getUpdateRequest(picture, authToken);
        } else {
            picture.companyRef = this.authService.loggedEmployee.companyRef;
            localPicture.companyRef = picture.companyRef;
            localItemVariant.mainPictureRequest = this.pictureClient.getCreateRequest(picture, authToken);
        }
        return localItemVariant.mainPictureRequest.run()
            .then((response)=> {
                var picRef:PictureRef = JSON.parse(response.text);
                localPicture.id = picRef.id;
                return localItemVariant;
            });
    }


    private fetchLocalItemVariantPictureAsync(localItemVariant:LocalItemVariant, pictureId:number):Promise<LocalItemVariant> {
        if (localItemVariant.mainPictureRequest != null) {
            localItemVariant.mainPictureRequest.discardRequest();
        }

        var authToken = this.authService.authToken;
        var request = this.pictureClient.getGetRequest(pictureId, authToken)
        localItemVariant.mainPictureRequest = request;

        return localItemVariant.mainPictureRequest.run()
            .then((response:ComptoirResponse)=> {
                var picture:Picture = JSON.parse(response.text, ItemVariantFactory.fromJSONItemVariantReviver);
                var localPicture:LocalPicture = LocalPictureFactory.toLocalPicture(picture);
                localItemVariant.mainPicture = localPicture;
                localItemVariant.mainPictureRequest = null;
                return localItemVariant;
            });
    }

    private fetchLocalItemPictureAsync(localItem:LocalItem, pictureId:number):Promise<LocalItem> {
        if (localItem.mainPictureRequest != null) {
            localItem.mainPictureRequest.discardRequest();
        }

        var authToken = this.authService.authToken;
        var request = this.pictureClient.getGetRequest(pictureId, authToken)
        localItem.mainPictureRequest = request;

        return localItem.mainPictureRequest.run()
            .then((response:ComptoirResponse)=> {
                var picture:Picture = JSON.parse(response.text, ItemVariantFactory.fromJSONItemVariantReviver);
                var localPicture:LocalPicture = LocalPictureFactory.toLocalPicture(picture);
                localItem.mainPicture = localPicture;
                localItem.mainPictureRequest = null;
                return localItem;
            });
    }


    private fetchLocalItemVariantItemAsync(localItemVariant:LocalItemVariant, itemId:number, conf?:any):Promise<LocalItemVariant> {
        if (localItemVariant.itemRequest != null) {
            localItemVariant.itemRequest.discardRequest();
        }
        var authToken = this.authService.authToken;
        if (conf == null) {
            conf = {picture: true};
        }
        var request = this.itemClient.getGetRequest(itemId, authToken);
        localItemVariant.itemRequest = request;

        return localItemVariant.itemRequest.run()
            .then((response:ComptoirResponse)=> {
                var item:Item = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                var localItem:LocalItem = LocalItemFactory.toLocalItem(item);
                localItemVariant.item = localItem;
                localItemVariant.itemRequest = null;

                if (conf.picture && localItemVariant.mainPicture == null) {
                    var picRef = item.mainPictureRef;
                    if (picRef != null) {
                        var picId = picRef.id;
                        return this.fetchLocalItemPictureAsync(localItem, picId)
                            .then(()=> {
                                return localItemVariant;
                            });
                    }
                }
                return localItemVariant;
            });
    }


}