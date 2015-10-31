/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalItem, LocalItemFactory} from '../client/localDomain/item';
import {ItemClient, Item, ItemRef, ItemSearch} from '../client/domain/item';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class ItemService extends BasicLocalService<Item, LocalItem> {


    constructor( authService:AuthService) {
        var client= new ItemClient();
        super(<BasicLocalServiceInfo<Item, LocalItem>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalItemFactory.fromLocalItem,
            toLocalConverter: LocalItemFactory.toLocalItem
        } );
    }

}