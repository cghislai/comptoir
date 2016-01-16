/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {ItemVariant,Pricing, ItemVariantRef, ItemVariantSearch, ItemVariantFactory} from '../client/domain/itemVariant';
import {AttributeValueRef} from '../client/domain/attributeValue';
import {ItemRef} from '../client/domain/item';
import {PictureRef} from '../client/domain/picture';

import {LocalItemVariant, LocalItemVariantFactory} from '../client/localDomain/itemVariant';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {ItemVariantClient} from '../client/itemVariant';

import {AuthService} from './auth';
import {AttributeValueService} from './attributeValue';
import {ItemService} from './item';
import {PictureService} from './picture';

@Injectable()
export class ItemVariantService {
    private itemVariantClient:ItemVariantClient;
    private authService:AuthService;
    private attributeValueService:AttributeValueService;
    private itemService:ItemService;
    private pictureService:PictureService;


    constructor(itemVariantClient:ItemVariantClient,
                authService: AuthService,
                attributeValueService:AttributeValueService,
                itemService:ItemService,
                pictureService:PictureService) {
        this.itemVariantClient = itemVariantClient;
        this.authService = authService;
        this.attributeValueService = attributeValueService;
        this.itemService = itemService;
        this.pictureService = pictureService;

    }

    get(id:number):Promise<LocalItemVariant> {
        return  this.itemVariantClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:ItemVariant)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return  this.itemVariantClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalItemVariant):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return  this.itemVariantClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalItemVariant>):Promise<SearchResult<LocalItemVariant>> {
        return  this.itemVariantClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<ItemVariant>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalItemVariant>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(itemVariant:ItemVariant):Promise<LocalItemVariant> {
        var localVariantDesc:any = {};
        localVariantDesc.id = itemVariant.id;
        localVariantDesc.variantReference = itemVariant.variantReference;
        localVariantDesc.pricing = Pricing[itemVariant.pricing];
        localVariantDesc.pricingAmount = itemVariant.pricingAmount;

        localVariantDesc.attributeValues = [];
        var taskList = [];
        var attributeValueRefList = itemVariant.attributeValueRefs;


         for (var attributeValueRef of attributeValueRefList) {
            var attributeid = attributeValueRef.id;
            taskList.push(
                this.attributeValueService.get(attributeid)
                    .then((localValue)=> {
                        localVariantDesc.attributeValues.push(localValue);
                    })
            );
        }

        var itemRef = itemVariant.itemRef;
        taskList.push(
            this.itemService.get(itemRef.id)
                .then((localItem)=> {
                    localVariantDesc.item = localItem;
                })
        );

        var mainPictureRef = itemVariant.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            taskList.push(
                this.pictureService.get(picId)
                    .then((localPicture)=> {
                        localVariantDesc.mainPicture = localPicture;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return LocalItemVariantFactory.createNewItemVariant(localVariantDesc);
            });
    }

    fromLocalConverter(localItemVariant:LocalItemVariant):ItemVariant {
        var itemVariant:ItemVariant = new ItemVariant();
        itemVariant.attributeValueRefs = [];
        for (var localAttribute of localItemVariant.attributeValues) {
            var attributeValueRef:AttributeValueRef = new AttributeValueRef(localAttribute.id);
            itemVariant.attributeValueRefs.push(attributeValueRef);
        }
        itemVariant.id = localItemVariant.id;
        if (localItemVariant.item != null) {
            itemVariant.itemRef = new ItemRef(localItemVariant.item.id);
        }
        if (localItemVariant.mainPicture != null) {
            itemVariant.mainPictureRef = new PictureRef(localItemVariant.mainPicture.id);
        }
        itemVariant.pricing = Pricing[localItemVariant.pricing];
        itemVariant.pricingAmount = localItemVariant.pricingAmount;
        itemVariant.variantReference = localItemVariant.variantReference;
        return itemVariant;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}