/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {PosClient, Pos, PosRef, PosSearch} from 'client/domain/pos';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicService, BasicServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';

export class PosService extends BasicService<Pos> {

    lastUsedPos: Pos;

    constructor(@Inject authService:AuthService) {
        var client= new PosClient();
        super({
            client: client,
            authService: authService
        } );
    }

}