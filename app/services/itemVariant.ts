/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {ItemVariant, ItemVariantRef, ItemVariantSearch, ItemVariantFactory, AttributeDefinition} from 'client/domain/itemVariant';
import {Item, ItemRef, ItemFactory} from 'client/domain/item';
import {ItemPicture, ItemPictureRef} from 'client/domain/itemPicture';

import {LocalItem, LocalItemFactory}from 'client/localDomain/item';
import {LocalAttributeValue,  LocalItemVariant, LocalItemVariantFactory}from 'client/localDomain/itemVariant';
import {LocalPicture, LocalPictureFactory}from 'client/localDomain/picture';

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {PicturedItemVariant, PicturedItemFactory} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
import {ComptoirResponse} from'client/utils/request';

import {ItemClient} from 'client/item';
import {ItemVariantClient} from 'client/itemVariant';
import {ItemPictureClient} from 'client/itemPicture'

import {AuthService} from 'services/auth';


export class ItemVariantService {
    private authService:AuthService;
    private itemClient:ItemClient;
    private itemVariantClient:ItemVariantClient;
    private pictureClient:ItemPictureClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.itemClient = new ItemClient();
        this.itemVariantClient = new ItemVariantClient();
        this.pictureClient = new ItemPictureClient();
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
        itemVariantSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemVariantClient.searchItemVariants(itemVariantSearch, pagination, authToken);
    }


    // Local items

    public getLocalItemVariantAsync(id:number):Promise<LocalItemVariant> {
        var localItemVariant = new LocalItemVariant();

        return this.getItemVariant(id)
            .then((itemVariant:ItemVariant)=> {
                return this.updateLocalItemVariantAsync(localItemVariant, itemVariant);
            });
    }

    public updateLocalItemVariantAsync(localItemVariant:LocalItemVariant, itemVariant:ItemVariant):Promise<LocalItemVariant> {
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
        if (itemVariant.attributeValues != null) {
            var attributesTasks = [];
            var localAttributeValues = [];
            for (var attributeValue of itemVariant.attributeValues) {
                var localAttribute = LocalItemVariantFactory.toLocalAttributeValue(attributeValue);
                attributesTasks.push(this.fetchLocalAttributeDefinitionAsync(localAttribute, attributeValue.attributeDefinitionRef.id));
            }
            var attributesTask = Promise.all(attributesTasks);
            tasks.push(attributesTask);
        }
        return Promise.all(tasks)
            .then(()=> {
                return localItemVariant;
            });
    }

    private fetchLocalAttributeDefinitionAsync(localAttributeValue:LocalAttributeValue, attributeDefinitionId:number):Promise<LocalAttributeValue> {
        if (localAttributeValue.attributeDefinitionRequest != null) {
            localAttributeValue.attributeDefinitionRequest.discardRequest();
        }

        // TODO
        return Promise.resolve(localAttributeValue);
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
                    taskList.push(this.updateItemVariant(itemVariant));
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
            var itemVariantPicture = LocalPictureFactory.fromLocalPicture(localPicture);
            // TODO          localItemVariant.mainPictureRequest = this.pictureClient.getUpdateItemVariantPictureRequest(itemVariantPicture, authToken);
        } else {
            // TODO   localItemVariant.mainPictureRequest = this.pictureClient.getCreateItemVariantPictureRequest(itemVariantPicture, authToken);
        }
        return localItemVariant.mainPictureRequest.run()
            .then((response)=> {
                // TODO var picRef:ItemVariantPictureRef = JSON.parse(response.text);
                //localPicture.id = picRef.id;
                return localItemVariant;
            });
    }


    private fetchLocalItemVariantPictureAsync(localItemVariant:LocalItemVariant, pictureId:number):Promise<LocalItemVariant> {
        if (localItemVariant.mainPictureRequest != null) {
            localItemVariant.mainPictureRequest.discardRequest();
        }

        var itemVariantId = localItemVariant.id;
        var authToken = this.authService.authToken;
        // TODO var request = this.pictureClient.getGetItemVariantPictureRequest(itemVariantId, pictureId, authToken)
        return Promise.resolve(localItemVariant);
        /*
         localItemVariant.mainPictureRequest = request;

         return localItemVariant.mainPictureRequest.run()
         .then((response:ComptoirResponse)=> {
         var itemVariantPicture:ItemVariantPicture = JSON.parse(response.text, ItemVariantFactory.fromJSONItemVariantReviver);
         var localItemVariantPicture:LocalPicture = LocalPictureFactory.toLocalPicture(itemVariantPicture);
         localItemVariant.mainPicture = localItemVariantPicture;
         localItemVariant.mainPictureRequest = null;
         return localItemVariant;
         });*/
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