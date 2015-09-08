/**
 * Created by cghislai on 01/09/15.
 */

import {Item} from 'client/domain/item';
import {Picture, PictureRef, PictureClient, PictureFactory} from 'client/domain/picture';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from 'client/domain/company';
import {LocalPicture, LocalPictureFactory} from 'client/localDomain/picture';
import {LocalCompany, LocalCompanyFactory} from 'client/localDomain/company';
import {LocaleTexts} from 'client/utils/lang';
import {ComptoirRequest} from 'client/utils/request';

export class LocalItem {
    id:number;
    company:LocalCompany;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPicture:LocalPicture;
}

export class LocalItemFactory {

    static toLocalItem(item:Item, authToken:string):Promise<LocalItem> {
        var localItem = new LocalItem();
        return LocalItemFactory.updateLocalItem(localItem, item, authToken);
    }


    static updateLocalItem(localItem:LocalItem, item:Item, authToken:string):Promise<LocalItem> {
        localItem.description = item.description;
        localItem.id = item.id;
        localItem.name = item.name;
        localItem.reference = item.reference;
        localItem.vatExclusive = item.vatExclusive;
        localItem.vatRate = item.vatRate;

        var taskList = [];
        var companyRef = item.companyRef;
        var companyClient = new CompanyClient();
        taskList.push(
            companyClient.getFromCacheOrServer(companyRef.id, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany: LocalCompany)=>{
                    localItem.company = localCompany;
                })
        );

        var mainPictureRef = item.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            var pictureClient = new PictureClient();
            taskList.push(
                pictureClient.getFromCacheOrServer(picId, authToken)
                    .then((picture)=> {
                        return LocalPictureFactory.toLocalPicture(picture, authToken);
                    }).then((localPicture: LocalPicture)=> {
                        localItem.mainPicture = localPicture;
                    })
            );
        }
        return Promise.all(taskList)
            .then(()=> {
                return localItem;
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
