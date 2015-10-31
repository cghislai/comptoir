/**
 * Created by cghislai on 01/09/15.
 */

import {Item} from '../domain/item';
import {Picture, PictureRef, PictureClient, PictureFactory} from '../domain/picture';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from '../domain/company';

import {LocalPicture, LocalPictureFactory} from './picture';
import {LocalCompany, LocalCompanyFactory} from './company';

import {LocaleTexts} from '../utils/lang';

import {Map, Record} from 'immutable';

export interface LocalItem extends Map<string, any> {
    id:number;
    company:LocalCompany;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPicture:LocalPicture;
}
var ItemRecord = Record({
    id: null,
    company: null,
    reference: null,
    name: null,
    description: null,
    vatExclusive: null,
    vatRate: null,
    mainPicture: null
});
export function NewItem(desc:any):LocalItem {
    return <any>ItemRecord(desc);
}

export class LocalItemFactory {

    static companyClient = new CompanyClient();
    static pictureClient = new PictureClient();

    static toLocalItem(item:Item, authToken:string):Promise<LocalItem> {
        var localItemDesc:any = {};
        localItemDesc.description = item.description;
        localItemDesc.id = item.id;
        localItemDesc.name = item.name;
        localItemDesc.reference = item.reference;
        localItemDesc.vatExclusive = item.vatExclusive;
        localItemDesc.vatRate = item.vatRate;

        var taskList = [];
        var companyRef = item.companyRef;
        taskList.push(
            LocalItemFactory.companyClient.getFromCacheOrServer(companyRef.id, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany:LocalCompany)=> {
                    localItemDesc.company = localCompany;
                })
        );

        var mainPictureRef = item.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            taskList.push(
                LocalItemFactory.pictureClient.getFromCacheOrServer(picId, authToken)
                    .then((picture)=> {
                        return LocalPictureFactory.toLocalPicture(picture, authToken);
                    }).then((localPicture:LocalPicture)=> {
                        localItemDesc.mainPicture = localPicture;
                    })
            );
        }
        return Promise.all(taskList)
            .then(()=> {
                return NewItem(localItemDesc);
            });
    }

    static fromLocalItem(localItem:LocalItem) {
        var item = new Item();
        item.companyRef = new CompanyRef(localItem.company.id);
        item.description = localItem.description;
        item.id = localItem.id;
        if (localItem.mainPicture != null) {
            var picId = localItem.mainPicture.id;
            var picRef = new PictureRef(picId)
            item.mainPictureRef = picRef;
        }
        item.name = localItem.name;
        item.reference = localItem.reference;
        item.vatExclusive = localItem.vatExclusive;
        item.vatRate = localItem.vatRate;
        return item;
    }
}
