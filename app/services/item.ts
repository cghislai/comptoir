/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalItem, LocalItemFactory} from 'client/localDomain/item';
import {ItemClient, Item, ItemRef, ItemSearch} from 'client/domain/item';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';

export class ItemService extends BasicLocalService<Item, LocalItem> {


    constructor(@Inject authService:AuthService) {
        var client:BasicClient<Item> = new ItemClient();
        super({
            client: client,
            authService: authService,
            fromLocalConverter: LocalItemFactory.fromLocalItem,
            toLocalConverter: LocalItemFactory.toLocalItem,
            updateLocal: LocalItemFactory.updateLocalItem
        } );
    }

}