/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/angular2';

import {LocalItemVariant, LocalItemVariantFactory} from 'client/localDomain/itemVariant';
import {ItemVariantClient, ItemVariant,  ItemVariantRef, ItemVariantSearch} from 'client/domain/itemVariant';

import {BasicClient} from 'client/utils/basicClient';
import {SearchRequest, SearchResult} from 'client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from 'services/basicService';
import {AuthService} from 'services/auth';

export class ItemVariantService extends BasicLocalService<ItemVariant, LocalItemVariant> {


    constructor(@Inject authService:AuthService) {
        var client = new ItemVariantClient();
        super(<BasicLocalServiceInfo<ItemVariant, LocalItemVariant>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalItemVariantFactory.fromLocalItemVariant,
            toLocalConverter: LocalItemVariantFactory.toLocalItemVariant
        } );
    }

}