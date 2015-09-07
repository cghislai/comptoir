/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {ItemClient, Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {PictureClient, Picture, PictureRef} from 'client/domain/picture';

import {LocalItem, LocalItemFactory} from 'client/localDomain/item';
import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';

import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
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
        return this.itemClient.create(item, authToken);
    }

    public updateItem(item:Item):Promise<ItemRef> {
        var authToken = this.authService.authToken;
        return this.itemClient.update(item, authToken);
    }

    public getItem(id:number):Promise<Item> {
        var authToken = this.authService.authToken;
        return this.itemClient.get(id, authToken);
    }

    public searchItems(itemSearch:ItemSearch, pagination:Pagination):Promise<SearchResult<Item>> {
        itemSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemClient.search(itemSearch, pagination, authToken);
    }

    public deleteItem(id: number):Promise<any> {
        var authToken = this.authService.authToken;
        return this.itemClient.remove(id, authToken);
    }

    // Local items

    public getLocalItemAsync(id:number):Promise<LocalItem> {
        var localItem = new LocalItem();

        return this.getItem(id)
            .then((item:Item)=> {
                LocalItemFactory.updateLocalItem(localItem, item);
                var pictureRef = item.mainPictureRef;
                if (pictureRef != null) {
                    return this.fetchLocalItemPictureAsync(localItem, pictureRef.id);
                } else {
                    return localItem;
                }
            });
    }

    public saveLocalItemAsync(localItem:LocalItem):Promise<LocalItem> {
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

    public saveLocalItemPictureAsync(localItem:LocalItem):Promise<LocalItem> {
        var localPicture = localItem.mainPicture;
        if (localPicture == null) {
            return Promise.resolve(localItem);
        }
        if (localItem.mainPictureRequest != null) {
            localItem.mainPictureRequest = null;
        }
        var authToken = this.authService.authToken;
        var pictureExists = localPicture.id != null;
        var picture = LocalPictureFactory.fromLocalPicture(localPicture);
        if (pictureExists) {
            localItem.mainPictureRequest = this.pictureClient.getUpdateRequest(picture, authToken);
        } else {
            picture.companyRef = this.authService.loggedEmployee.companyRef;
            localPicture.companyRef = picture.companyRef;
            localItem.mainPictureRequest = this.pictureClient.getCreateRequest(picture, authToken);
        }
        return localItem.mainPictureRequest.run()
            .then((response)=> {
                var picRef:PictureRef = JSON.parse(response.text);
                localPicture.id = picRef.id;
                return localItem;
            });
    }


    public fetchLocalItemPictureAsync(localItem:LocalItem, pictureId:number):Promise<LocalItem> {
        if (localItem.mainPictureRequest != null) {
            localItem.mainPictureRequest.discardRequest();
        }

        var authToken = this.authService.authToken;
        var request = this.pictureClient.getGetRequest(pictureId, authToken)
        localItem.mainPictureRequest = request;

        return localItem.mainPictureRequest.run()
            .then((response:ComptoirResponse)=> {
                var picture:Picture = JSON.parse(response.text, ItemFactory.fromJSONItemReviver);
                var localPicture:LocalPicture = LocalPictureFactory.toLocalPicture(picture);
                localItem.mainPicture = localPicture;
                localItem.mainPictureRequest = null;
                return localItem;
            });
    }
}