/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {ItemPicture, ItemPictureRef} from 'client/domain/itemPicture';

import {LocalItem, LocalItemFactory} from 'client/localDomain/item';
import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';

import {ItemClient} from 'client/item';
import {PictureClient} from 'client/picture'
import {ComptoirResponse} from 'client/utils/request';

import {AuthService} from 'services/auth';


export class ItemService {
    private authService:AuthService;
    private itemClient:ItemClient;
    private pictureClient:PictureClient;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.itemClient = new ItemClient();
        this.pictureClient = new PictureClient();
    }


    public createItem(item:Item):Promise<ItemRef> {
        item.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemClient.createItem(item, authToken);
    }

    public updateItem(item:Item):Promise<ItemRef> {
        var authToken = this.authService.authToken;
        return this.itemClient.updateItem(item, authToken);
    }

    public getItem(id:number):Promise<Item> {
        var authToken = this.authService.authToken;
        return this.itemClient.getItem(id, authToken);
    }

    public searchItems(itemSearch:ItemSearch, pagination:Pagination):Promise<SearchResult<Item>> {
        itemSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemClient.searchItems(itemSearch, pagination, authToken);
    }

    public deleteItem(id: number):Promise<any> {
        var authToken = this.authService.authToken;
        return this.itemClient.deleteItem(id, authToken);
    }

    // Local items

    public getLocalItemAsync(id:number):Promise<LocalItem> {
        var localItem = new LocalItem();

        return this.getItem(id)
            .then((item:Item)=> {
                LocalItemFactory.updateLocalItem(localItem, item);
                return this.fetchLocalItemPictureAsync(localItem, item.mainPictureRef.id);
            });
    }

    public saveLocalItemAsync(localItem:LocalItem):Promise<LocalItem> {
        return this.saveLocalItemPictureAsync(localItem)
            .then(()=> {
                var item = LocalItemFactory.fromLocalItem(localItem);
                var authToken = this.authService.authToken;
                var itemExists = item.id != null;
                if (itemExists) {
                    return this.updateItem(item)
                        .then(()=> {
                            return localItem;
                        });
                } else {
                    return this.createItem(item)
                        .then((itemRef)=> {
                            localItem.id = itemRef.id;
                            return localItem;
                        });
                }
            });
    }

    public searchLocalItemsAsync(itemSearch:ItemSearch, pagination:Pagination):Promise<SearchResult<LocalItem>> {
        itemSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.searchItems(itemSearch, pagination)
            .then((result)=> {
                var localResult = new SearchResult<LocalItem>();
                localResult.count = result.count;
                localResult.list = [];
                var taskList = [];
                for (var item of result.list) {
                    var localItem = LocalItemFactory.toLocalItem(item);
                    localResult.list.push(localItem);

                    var picRef = item.mainPictureRef;
                    if (picRef != null) {
                        taskList.push(this.fetchLocalItemPictureAsync(localItem, picRef.id));
                    }
                }
                return Promise.all(taskList)
                    .then(()=> {
                        return localResult;
                    });
            });
    }

    public removeLocalItemAsync(localItem: LocalItem) : Promise<any> {
        return this.deleteItem(localItem.id);
    }

    private saveLocalItemPictureAsync(localItem:LocalItem):Promise<LocalItem> {
        var localPicture = localItem.mainPicture;
        if (localPicture == null) {
            return Promise.resolve(localItem);
        }
        if (localItem.mainPictureRequest != null) {
            localItem.mainPictureRequest = null;
        }
        var authToken = this.authService.authToken;
        var pictureExists = localPicture.id != null;
        if (pictureExists) {
            var picture = LocalPictureFactory.fromLocalPicture(localPicture);
            localItem.mainPictureRequest = this.pictureClient.getUpdatePictureRequest(picture, authToken);
        } else {
            localItem.mainPictureRequest = this.pictureClient.getCreatePictureRequest(picture, authToken);
        }
        return localItem.mainPictureRequest.run()
            .then((response)=> {
                var picRef:ItemPictureRef = JSON.parse(response.text);
                localPicture.id = picRef.id;
                return localItem;
            });
    }


    private fetchLocalItemPictureAsync(localItem:LocalItem, pictureId:number):Promise<LocalItem> {
        if (localItem.mainPictureRequest != null) {
            localItem.mainPictureRequest.discardRequest();
        }

        var authToken = this.authService.authToken;
        var request = this.pictureClient.getGetPictureRequest(pictureId, authToken)
        localItem.mainPictureRequest = request;

        return localItem.mainPictureRequest.run()
            .then((response:ComptoirResponse)=> {
                var picture:ItemPicture = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                var localPicture:LocalPicture = LocalPictureFactory.toLocalPicture(picture);
                localItem.mainPicture = localPicture;
                localItem.mainPictureRequest = null;
                return localItem;
            });
    }
}