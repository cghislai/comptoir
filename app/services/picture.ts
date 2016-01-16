/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {Picture, PictureRef, PictureSearch, PictureFactory} from '../client/domain/picture';
import {CompanyRef} from '../client/domain/company';

import {LocalPicture, LocalPictureFactory} from '../client/localDomain/picture';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {PictureClient} from '../client/picture';
import {AuthService} from './auth';
import {CompanyService} from './company';

@Injectable()
export class PictureService {
    private pictureClient:PictureClient;
    private authService:AuthService;
    private companyService:CompanyService;


    constructor(pictureClient:PictureClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.pictureClient = pictureClient;
        this.authService = authService;
        this.companyService = companyService;


    }

    get(id:number):Promise<LocalPicture> {
        return this.pictureClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:Picture)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.pictureClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalPicture):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.pictureClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalPicture>):Promise<SearchResult<LocalPicture>> {
        return this.pictureClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<Picture>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalPicture>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(picture:Picture):Promise<LocalPicture> {
        var localPictureDesc:any = {};
        localPictureDesc.id = picture.id;
        localPictureDesc.data = picture.data;
        localPictureDesc.contentType = picture.contentType;
        localPictureDesc.dataURI = LocalPictureFactory.toDataURI(picture);

        var taskList = [];
        var companyRef = picture.companyRef;


        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((localCompany)=> {
                    localPictureDesc.company = localCompany;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalPictureFactory.createNewPicture(localPictureDesc);
            });
    }

    fromLocalConverter(localPicture:LocalPicture):Picture {
        var picture = new Picture();
        picture.id = localPicture.id;
        picture.companyRef = new CompanyRef(localPicture.company.id);
        picture.data = localPicture.data;
        picture.contentType = localPicture.contentType;
        if (localPicture.dataURI != null) {
            LocalPictureFactory.fromDataURI(localPicture.dataURI, picture);
        }
        return picture;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}