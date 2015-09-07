/**
 * Created by cghislai on 06/08/15.
 */

import {Inject} from 'angular2/angular2';

import {PosClient, Pos, PosRef, PosSearch} from 'client/domain/pos';
import {LocaleTexts} from 'client/utils/lang';
import {SearchResult} from 'client/utils/search';
import {Pagination} from 'client/utils/pagination';

import {AuthService} from 'services/auth';

export class PosService {

    client:PosClient;
    authService:AuthService;

    lastUsedPos: Pos;

    constructor(@Inject authService:AuthService) {
        this.client = new PosClient();
        this.authService = authService;
    }

    createPos(pos:Pos):Promise<PosRef> {
        var authToken = this.authService.authToken;
        pos.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.create(pos, authToken);
    }

    updatePos(pos:Pos):Promise<PosRef> {
        var authToken = this.authService.authToken;
        return this.client.update(pos, authToken);
    }


    savePos(pos: Pos) : Promise<PosRef> {
        var savePromise : Promise<PosRef>;
        if (pos.id == undefined) {
            savePromise = this.createPos(pos);
        } else {
            savePromise = this.updatePos(pos);
        }
        return savePromise.then((posRef)=>{
            pos.id = posRef.id;
            return posRef;
        });
    }

    getPos(id:number):Promise<Pos> {
        var authToken = this.authService.authToken;
        return this.client.get(id, authToken);
    }

    searchPos(posSearch:PosSearch, pagination:Pagination):Promise<SearchResult<Pos>> {
        var authToken = this.authService.authToken;
        posSearch.companyRef = this.authService.loggedEmployee.companyRef;
        return this.client.search(posSearch, pagination, authToken);
    }


    removePos(pos:Pos):Promise<boolean> {
        var authToken = this.authService.authToken;
        return this.client.remove(pos.id, authToken);
    }

}