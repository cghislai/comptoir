/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {Item, ItemRef, ItemSearch, ItemFactory} from 'client/domain/item';
import {ItemPicture, ItemPictureRef} from 'client/domain/itemPicture';
import {LocaleTexts, LocaleTextsFactory} from 'client/utils/lang';
import {PicturedItem, PicturedItemFactory} from 'client/utils/picture';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/searchResult';
import {ItemClient} from 'client/item';
import {ItemPictureClient} from 'client/itemPicture'

import {AuthService} from 'services/auth';


export class ItemService {
    private itemClient:ItemClient;
    private pictureClient:ItemPictureClient;
    private authService:AuthService;

    private fakeData:Item[];

    constructor(@Inject authService:AuthService) {
        this.authService = authService;
        this.itemClient = new ItemClient();
        this.pictureClient = new ItemPictureClient();
        this.initFakeData();
    }


    public getItem(id:number):Promise<Item> {
        var allItems = this.fakeData;
        // TODO
        return new Promise((resolve, reject) => {
            for (var item of allItems) {
                if (item.id == id) {
                    resolve(item);
                    return;
                }
            }
            resolve(null); //TODO: or throw?
        });
    }

    /**
     * Resolves the returned promise as soon as the item is fetched with
     * a PicturedItem instance.
     * The picture is fetched asynchronously, then the PicturedItem is updated
     * @param id item id
     * @returns {Promise<PicturedItem>}
     */
    public getPicturedItemAsync(id:number):Promise<PicturedItem> {
        var authToken = this.authService.authToken;
        var thisService = this;

        return this.getItem(id)
            .then((item)=> {
                if (item == undefined) {
                    return undefined;
                }
                var picItem = new PicturedItem();
                picItem.item = item;
                var picRef = item.mainPictureRef;
                if (picRef == undefined) {
                    return picItem;
                }

                var picId = picRef.id;
                this.pictureClient.getItemPicture(picId, authToken)
                    .then((pic)=> {
                        picItem.picture = pic;
                        if (pic != undefined) {
                            var dataURI = PicturedItemFactory.buildPictureURI(pic);
                            picItem.dataURI = dataURI;
                        }
                    });
                return picItem;
            });
    }

    /**
     * Fetch the item then the picture then resolve the returned
     * promise with a PicturedItem instance
     * @param id item id
     * @returns {Promise<PicturedItem>}
     */
    public getPicturedItemSync(id:number):Promise<PicturedItem> {
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
                    this.pictureClient.getItemPicture(picId, authToken)
                        .then((pic)=> {
                            picItem.picture = pic;
                            if (pic != undefined) {
                                picItem.dataURI = PicturedItemFactory.buildPictureURI(pic);
                            }
                            resolve(picItem);
                            return;
                        })
                });
        });
    }

    /**
     * Fetches the picture asynchronlously. The resolved SearchResult
     * list values will be updated.
     * @param itemSearch
     * @returns {Promise<SearchResult<PicturedItem>>}
     */
    public searchPicturedItems(itemSearch:ItemSearch):Promise<SearchResult<PicturedItem>> {
        var authToken = this.authService.authToken;
        var thisService = this;

        return this.searchItems(itemSearch)
            .then(function (itemResult : SearchResult<Item>) {
                var result = new SearchResult<PicturedItem>();
                result.count = itemResult.count;
                result.list = [];
                for (var item of itemResult.list) {
                    var picItem = new PicturedItem();
                    picItem.item = item;
                    result.list.push(picItem);
                }
                return result;
/*            }).then((result)=> {

                var allImagesPromise = Promise.all(
                    result.list.map((picItem:PicturedItem)=> {
                        var item = picItem.item;
                        var picRef = item.mainPictureRef;
                        console.log("pic ref: " + picRef);
                        if (picRef == undefined) {
                            return Promise.resolve();
                        }
                        var picId = picRef.id;
                        console.log("pic id: " + picId);
                        return thisService.pictureClient.getItemPicture(picId, authToken)
                            .then(function (itemPic:ItemPicture) {
                                console.log("got item pic : " + itemPic);
                                if (itemPic != undefined) {
                                    var dataURI = PicturedItemFactory.buildPictureURI(itemPic);
                                    picItem.dataURI = dataURI;
                                }
                                return itemPic;
                            }, (error)=> {
                                return null;
                            });
                    })
                )
                var resultPromise = Promise.resolve();
                return resultPromise.then(()=>{
                    return result;
                });*/
            });
    }

    public searchItems(itemSearch:ItemSearch):Promise<SearchResult<Item>> {
        // TODO
        var allItems = this.fakeData;
        return new Promise((resolve, reject) => {
            var items = allItems;
            var searchResult = new SearchResult<Item>();
            if (itemSearch == null) {
                searchResult.count = allItems.length;
                searchResult.list = allItems;
                resolve(searchResult);
            }
            var multiStringValue = itemSearch.multiSearch;
            if (multiStringValue != null && multiStringValue.length > 0) {
                var foundItems = [];
                for (var item of allItems) {
                    if (item.reference.indexOf(multiStringValue) == 0) {
                        foundItems.push(item);
                        continue;
                    }
                    var itemName = item.name;
                    for (var lang in itemName) {
                        var name:string = itemName[lang];
                        if (name != undefined && name.indexOf(multiStringValue) >= 0) {
                            foundItems.push(item);
                            continue;
                        }
                    }
                }
                items = foundItems;
            }
            var pagination = itemSearch.pagination;
            if (pagination != null) {
                var first = pagination.firstIndex;
                var size = pagination.pageSize;
                size = Math.min(size, items.length);
                var pageItems = [];
                for (var pageIndex = 0; pageIndex < size; pageIndex++) {
                    var item = items[first + pageIndex];
                    pageItems.push(item);
                }
                items = pageItems;
            }
            var result = new SearchResult<Item>();
            result.count = allItems.length;
            result.list = items;
            resolve(result);
        });
    }

    public saveItem(item:Item):Promise<Item> {
        // TODO
        var id = this.fakeData.length;
        item.id = id;
        var thisService = this;
        return new Promise((resolve, reject) => {
            if (item.id != null) {
                resolve(item);
            }
            thisService.fakeData.push(item);
            resolve(item);
        });
    }

    public savePicturedItem(picturedItem:PicturedItem):Promise<PicturedItem> {
        // TODO
        var thisService = this;
        var authToken = this.authService.authToken;

        return new Promise<PicturedItem>((resolve, reject)=> {
            // Convert, save, update or remove picture
            var pic = picturedItem.picture;
            var dataURI = picturedItem.dataURI;

            if (dataURI != null) {
                if (pic == undefined) {
                    pic = new ItemPicture();
                }
                PicturedItemFactory.buildPictureDataFromDataURI(dataURI, pic);
                if (pic.id == undefined) {
                    thisService.pictureClient.createItemPicture(pic, authToken)
                        .then((picRef)=> {
                            pic.id = picRef.id;
                            resolve(picturedItem);
                        })
                } else {
                    thisService.pictureClient.updateItemPicture(pic, authToken);
                    resolve(picturedItem);
                }
            } else {
                // No picture data
                if (pic != undefined) {
                    picturedItem.picture = null;
                }
                resolve(picturedItem);
            }
        }).then((picItem:PicturedItem)=> {
                // Save item
                var item = picItem.item;
                var pic = picItem.picture;
                if (pic == undefined) {
                    item.mainPictureRef = null;
                } else {
                    var picRef = new ItemPictureRef();
                    picRef.id = pic.id;
                    item.mainPictureRef = picRef;
                }

                return thisService.saveItem(item)
                    .then((savedItem)=> {
                        picItem.item = savedItem;
                        return picItem;
                    });
            });
    }


    public
    removeItem(item:Item):Promise<boolean> {
        // TODO
        var thisService = this;
        return new Promise((resolve, reject) => {
            var oldItems = thisService.fakeData;
            thisService.fakeData = [];
            for (var index = 0; index < oldItems.length; index++) {
                var oldItem = oldItems[index];
                if (oldItem.id == item.id && item.id != undefined) {
                    continue;
                }
                thisService.fakeData.push(oldItem);
            }
            resolve(true);
        });

    }

    private
    initFakeData() {
        // TODO REMOVE
        var allItems = [
            {
                id: 0,
                companyId: 0,
                reference: "BO001",
                model: null,
                name: [{locale:'fr', text:"Bonnet Minnie"}],
                description:  [{locale:'fr', text:"Un bonnet à l'effigie de Minnie, la copine de Mickey."}],
                vatRate: 0.21,
                vatExclusive: 5.9
            },
            {
                id: 1,
                companyId: 0,
                reference: "BO002",
                model: undefined,
                name:  [{locale:'fr', text: "Bonnet Mickey"}],
                description: [{locale:'fr', text:"Un bonnet à l'effigie de Mickey Mouse. Pour garçons et filles"}],
                vatRate: 0.21,
                vatExclusive: 5.9
            },
            {
                id: 2,
                companyId: 0,
                reference: "PU001",
                model: "8 ans vert",
                name: [{locale:'fr', text:"Pull en laine Defrost"}],
                description: undefined,
                vatRate: 0.21,
                vatExclusive: 21.5
            },
            {
                id: 3,
                companyId: 0,
                reference: "PU002",
                model: "8 ans rouge",
                name:[{locale:'fr', text:"Pull en laine Defrost"}],
                description: undefined,
                vatRate: 0.21,
                vatExclusive: 21.5
            },
            {
                id: 4,
                companyId: 0,
                reference: "PU003",
                model: "10-12 ans vert",
                name: [{locale:'fr', text: "Pull en laine Defrost"}],
                description: undefined,
                vatRate: 0.21,
                vatExclusive: 21.5
            },
            {
                id: 5,
                companyId: 0,
                reference: "PU004",
                model: "12-12 ans rouge",
                name:[{locale:'fr', text:"Pull en laine Defrost"}],
                description: undefined,
                vatRate: 0.21,
                vatExclusive: 21.5
            },
            {
                id: 6,
                companyId: 0,
                reference: "JDA001",
                model: "8 ans rouge",
                name:[{locale:'fr', text: "T-shirt Joli"}],
                description: [{locale:'fr', text: "Un joli T-shirt rouge"}],
                vatRate: 0.21,
                vatExclusive: 6
            },
            {
                id: 7,
                companyId: 0,
                reference: "JDA002",
                model: "10-12 ans rouge",
                name:  [{locale:'fr', text: "T-shirt Joli"}],
                description: [{locale:'fr', text: "Un joli T-shirt rouge"}],
                vatRate: 0.21,
                vatExclusive: 6
            },
            {
                id: 8,
                companyId: 0,
                reference: "JDA003",
                model: "S rouge",
                name: [{locale:'fr', text: "T-shirt Joli"}],
                description:[{locale:'fr', text: "Un joli T-shirt rouge"}],
                vatRate: 0.21,
                vatExclusive: 6
            },
            {
                id: 9,
                companyId: 0,
                reference: "JDA004",
                model: "M rouge",
                name:  [{locale:'fr', text: "T-shirt Joli"}],
                description: [{locale:'fr', text: "Un joli T-shirt rouge"}],
                vatRate: 0.21,
                vatExclusive: 6
            }
        ];
        this.fakeData = [];
        var jsonText = JSON.stringify(allItems);
        this.fakeData = JSON.parse(jsonText, ItemFactory.fromJSONItemReviver);
    }
}