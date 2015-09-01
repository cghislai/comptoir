/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {ItemVariant, ItemVariantRef, ItemVariantSearch, ItemVariantFactory} from 'client/domain/item';
import {ItemPicture, ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {PicturedItem, PicturedItemFactory} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';
import {ItemClient} from 'client/item';
import {ItemPictureClient} from 'client/itemPicture'

import {AuthService} from 'services/auth';


export class ItemService {
    private itemClient:ItemClient;
    private pictureClient:ItemPictureClient;
    private authService:AuthService;

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.itemClient = new ItemClient();
        this.pictureClient = new ItemPictureClient();
    }


    public createItem(item:ItemVariant):Promise<ItemVariantRef> {
        item.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemClient.createItemVariant(item, authToken);
    }

    public updateItem(item:ItemVariant):Promise<ItemVariantRef> {
        var authToken = this.authService.authToken;
        return this.itemClient.updateItemvariant(item, authToken);
    }

    public getItem(id:number):Promise<ItemVariant> {
        var authToken = this.authService.authToken;
        return this.itemClient.getItemVariant(id, authToken);
    }

    public searchItems(itemSearch:ItemVariantSearch, pagination:Pagination):Promise<SearchResult<ItemVariant>> {
        itemSearch.companyRef = this.authService.loggedEmployee.companyRef;
        var authToken = this.authService.authToken;
        return this.itemClient.searchItemVariants(itemSearch, pagination, authToken);
    }

    /**
     * Fetch the item then the picture then resolve the returned
     * promise with a PicturedItem instance
     * @param id item id
     * @returns {Promise<PicturedItem>}
     */
    public getPicturedItemASync(id:number):Promise<PicturedItem> {
        var authToken = this.authService.authToken;
        var thisService = this;

        return new Promise((resolve, reject)=> {
            var picItem = new PicturedItem();

            this.getItem(id)
                .then((item)=> {
                    picItem.item = item;
                    if (item.mainPictureRef == undefined) {
                        resolve(picItem);
                        return;
                    }
                    var picId = item.mainPictureRef.id;
                    this.pictureClient.getItemPicture(id, picId, authToken)
                        .then((pic)=> {
                            picItem.picture = pic;
                            if (pic != undefined) {
                                picItem.dataURI = PicturedItemFactory.buildPictureURI(pic);
                            }
                            resolve(picItem);
                            return;
                        });
                });
        });
    }


    /**
     * Fetches the picture asynchronlously. The resolved SearchResult
     * list values will be updated.
     * @param itemSearch
     * @returns {Promise<SearchResult<PicturedItem>>}
     */
    public searchPicturedItems(itemSearch:ItemVariantSearch, pagination:Pagination):Promise<SearchResult<PicturedItem>> {
        var thisService = this;
        var authToken = this.authService.authToken;
        return this.searchItems(itemSearch, pagination)
            .then(function (itemResult:SearchResult<ItemVariant>) {
                var result = new SearchResult<PicturedItem>();
                result.count = itemResult.count;
                result.list = [];


                for (var item of itemResult.list) {
                    var picturesPromise = [];
                    var picPromise = new Promise((resolve, reject)=> {
                        var picItem = new PicturedItem();
                        picItem.item = item;
                        thisService.findPicItemPicture(picItem);
                        result.list.push(picItem);
                    });
                }
                return result;
            });

    }

    private findPicItemPicture(picItem:PicturedItem) {
        var itemId = picItem.item.id;
        var picRef = picItem.item.mainPictureRef;
        if (picRef == null) {
            return null;
        }
        var picId = picRef.id;
        var authToken = this.authService.authToken;

        return this.pictureClient.getItemPicture(itemId, picId, authToken)
            .then((pic)=> {
                picItem.picture = pic;
                if (pic != undefined) {
                    picItem.dataURI = PicturedItemFactory.buildPictureURI(pic);
                }
                return picItem;
            });
    }


    public savePicturedItem(picturedItem:PicturedItem):Promise<ItemPictureRef> {
        var thisService = this;
        var authToken = this.authService.authToken;

        var item = picturedItem.item;
        var picture = picturedItem.picture;
        var pictureDataURI = picturedItem.dataURI;
        var hasPicture = (picture != undefined && picture.data != undefined)
            || pictureDataURI != undefined;

        if (!hasPicture) {
            item.mainPictureRef == null;
            picturedItem.picture = null;
            picture = null;
        } else {
            if (picturedItem.picture == null) {
                picture = new ItemPicture();
                PicturedItemFactory.buildPictureDataFromDataURI(pictureDataURI, picture);
                picturedItem.picture = picture;
            }
            if (pictureDataURI != null) {
                PicturedItemFactory.buildPictureDataFromDataURI(pictureDataURI, picture);
                picturedItem.picture = picture;
            }
        }
        var saveAction:Promise<ItemVariantRef>;
        if (item.id == null) {
            saveAction = this.createItem(item);
        } else {
            saveAction = this.updateItem(item);
        }

        return saveAction
            .then((itemRef:ItemVariantRef)=> {
                // Save picture
                item.id = itemRef.id;
                if (picture == null) {
                    return null;
                }
                picture.itemVariantRef = itemRef;

                if (picture != null) {
                    if (picture.id == null) {
                        return this.pictureClient.createItemPicture(picture, authToken);
                    } else {
                        return this.pictureClient.updateItemPicture(picture, authToken);
                    }
                }
            }).then((pictureRef:ItemPictureRef)=> {
                item.mainPictureRef = pictureRef;
                return pictureRef;
            });

    }


    public removeItem(item:ItemVariant):Promise<boolean> {
        // TODO
        var thisService = this;
        return new Promise((resolve, reject) => {
            resolve(true);
        });

    }

}