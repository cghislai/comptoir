/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {AttributeDefinition, AttributeDefinitionFactory} from 'client/domain/attributeDefinition';
import {ItemVariant, ItemVariantRef, ItemVariantSearch, ItemVariantFactory} from 'client/domain/itemVariant';
import {Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {Picture, PictureRef, PictureFactory} from 'client/domain/picture';

import {LocalItem, LocalItemFactory}from 'client/localDomain/item';
import {LocalAttributeValue,  LocalItemVariant, LocalItemVariantFactory}from 'client/localDomain/itemVariant';
import {LocalPicture, LocalPictureFactory}from 'client/localDomain/picture';

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
import {ComptoirResponse} from'client/utils/request';

import {ItemClient} from 'client/item';
import {ItemVariantClient} from 'client/itemVariant';
import {PictureClient} from 'client/picture'
import {AttributeDefinitionClient} from 'client/attributeDefinition';
import {AttributeValueClient} from 'client/attributeValue';

import {AuthService} from 'services/auth';


export class ItemVariantService {
    private authService:AuthService;
    private itemClient:ItemClient;
    private itemVariantClient:ItemVariantClient;
    private pictureClient:PictureClient;
    private attributeDefinitiobClient:AttributeDefinitionClient;
    private attributeValueClient:AttributeValueClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.itemClient = new ItemClient();
        this.itemVariantClient = new ItemVariantClient();
        this.pictureClient = new PictureClient();
        this.attributeDefinitiobClient = new AttributeDefinitionClient();
        this.attributeValueClient = new AttributeValueClient();
    }


    public createItemVariant(itemVariant:ItemVariant):Promise<ItemVariantRef> {
        var authToken = this.authService.authToken;
        return this.itemVariantClient.createItemVariant(itemVariant, authToken);
    }

    public updateItemVariant(itemVariant:ItemVariant):Promise<ItemVariantRef> {
        var authToken = this.authService.authToken;
        return this.itemVariantClient.updateItemvariant(itemVariant, authToken);
    }

    public getItemVariant(id:number):Promise<ItemVariant> {
        var authToken = this.authService.authToken;
        return this.itemVariantClient.getItemVariant(id, authToken);
    }

    public searchItemsVariant(itemVariantSearch:ItemVariantSearch, pagination:Pagination):Promise<SearchResult<ItemVariant>> {
        if (itemVariantSearch.itemSearch == null) {
            itemVariantSearch.itemSearch = new ItemSearch();
        }
        itemVariantSearch.itemSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemVariantClient.searchItemVariants(itemVariantSearch, pagination, authToken);
    }


    // Local items

    public getLocalItemVariantAsync(id:number):Promise<LocalItemVariant> {
        var localItemVariant = new LocalItemVariant();

        return this.getItemVariant(id)
            .then((itemVariant:ItemVariant)=> {
                return this.refreshLocalItemVariantAsync(localItemVariant, itemVariant);
            });
    }

    public refreshLocalItemVariantAsync(localItemVariant:LocalItemVariant, itemVariant:ItemVariant):Promise<LocalItemVariant> {
        LocalItemVariantFactory.updateLocalItemVariant(localItemVariant, itemVariant);
        var tasks = [];
        if (itemVariant.mainPictureRef != null) {
            var pictureId = itemVariant.mainPictureRef.id;
            tasks.push(this.fetchLocalItemVariantPictureAsync(localItemVariant, pictureId));
        }
        if (itemVariant.itemRef != null) {
            var itemId = itemVariant.itemRef.id;
            tasks.push(this.fetchLocalItemVariantItemAsync(localItemVariant, itemId));
        }
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
        return Promise.all(tasks)
            .then(()=> {
                return localItemVariant;
            });
    }


    private fetchLocalAttributeValueAsync(attributeDefinitionId:number):Promise<LocalAttributeValue> {
        var authToken = this.authService.authToken;
        return this.attributeValueClient.getAttributeValue(attributeDefinitionId, authToken)
            .then((attributeValue)=> {
                var localValue = LocalItemVariantFactory.toLocalAttributeValue(attributeValue);

                localValue.attributeDefinitionRequest = this.attributeDefinitiobClient.getGetAttributeDefinitionRequest(attributeValue.attributeDefinitionRef.id, authToken);
                return localValue.attributeDefinitionRequest.run()
                    .then((response: ComptoirResponse)=> {
                        var attributeDefinition = JSON.parse(response.text, AttributeDefinitionFactory.fromJSONAttributeDefinitionReviver);
                        localValue.attributeDefinition = attributeDefinition;
                        localValue.attributeDefinitionRequest = null;
                        return localValue;
                    });
            });
    }

    public saveLocalItemVariantAttribute(localAttribute:LocalAttributeValue) : Promise<LocalAttributeValue> {
        var attributeDefinition = localAttribute.attributeDefinition;
        var definitionId = attributeDefinition.id;

        var authToken = this.authService.authToken;
        var createDefinitionTask = Promise.resolve(attributeDefinition);
        if (definitionId == null) {
            attributeDefinition.companyRef = this.authService.loggedEmployee.companyRef;
            createDefinitionTask = this.attributeDefinitiobClient.createAttributeDefinition(attributeDefinition, authToken)
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
                return this.attributeValueClient.createAttributeValue(attributeValue, authToken)
                    .then((attributeRef)=> {
                        localAttribute.id = attributeRef.id;
                        return localAttribute;
                    });
            } else {
                return this.attributeValueClient.updateAttributeValue(attributeValue, authToken)
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

    public searchLocalItemVariantsAsyncNoRefresh(itemVariantSearch:ItemVariantSearch, pagination:Pagination):Promise<SearchResult<LocalItemVariant>> {
        return this.searchItemsVariant(itemVariantSearch, pagination)
            .then((result)=> {
                var localResult = new SearchResult<LocalItemVariant>();
                localResult.count = result.count;
                localResult.list = [];
                for (var itemVariant of result.list) {
                    var localItemVariant = LocalItemVariantFactory.toLocalItemVariant(itemVariant);
                    localResult.list.push(localItemVariant);
                }
                return localResult;
            });
    }


    public searchLocalItemVariantsAsync(itemVariantSearch:ItemVariantSearch, pagination:Pagination):Promise<SearchResult<LocalItemVariant>> {
        return this.searchItemsVariant(itemVariantSearch, pagination)
            .then((result)=> {
                var localResult = new SearchResult<LocalItemVariant>();
                localResult.count = result.count;
                localResult.list = [];
                var taskList = [];
                for (var itemVariant of result.list) {
                    var localItemVariant = LocalItemVariantFactory.toLocalItemVariant(itemVariant);
                    localResult.list.push(localItemVariant);
                    taskList.push(this.refreshLocalItemVariantAsync(localItemVariant, itemVariant));
                }
                return Promise.all(taskList)
                    .then(()=> {
                        return localResult;
                    });
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
        if (pictureExists) {
            var picture = LocalPictureFactory.fromLocalPicture(localPicture);
            localItemVariant.mainPictureRequest = this.pictureClient.getUpdatePictureRequest(picture, authToken);
        } else {
            localItemVariant.mainPictureRequest = this.pictureClient.getCreatePictureRequest(picture, authToken);
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
        var request = this.pictureClient.getGetPictureRequest(pictureId, authToken)
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


    private fetchLocalItemVariantItemAsync(localItemVariant:LocalItemVariant, itemId:number):Promise<LocalItemVariant> {
        if (localItemVariant.itemRequest != null) {
            localItemVariant.itemRequest.discardRequest();
        }
        var authToken = this.authService.authToken;

        var request = this.itemClient.getGetItemRequest(itemId, authToken);
        localItemVariant.itemRequest = request;

        return localItemVariant.itemRequest.run()
            .then((response:ComptoirResponse)=> {
                var item:Item = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                var localItem:LocalItem = LocalItemFactory.toLocalItem(item);
                localItemVariant.item = localItem;
                localItemVariant.itemRequest = null;
                return localItemVariant;
            });
    }


}