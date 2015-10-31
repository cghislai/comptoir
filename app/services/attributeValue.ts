/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {AttributeValue, AttributeValueRef, AttributeValueClient, AttributeValueFactory} from '../client/domain/attributeValue';
import {LocalAttributeValue, LocalAttributeValueFactory} from '../client/localDomain/attributeValue';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';


export class AttributeValueService extends BasicLocalService<AttributeValue, LocalAttributeValue> {

    constructor(@Inject(AuthService) authService:AuthService) {
        var client = new AttributeValueClient();
        super(<BasicLocalServiceInfo<AttributeValue, LocalAttributeValue>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalAttributeValueFactory.fromLocalAttributeValue,
            toLocalConverter: LocalAttributeValueFactory.toLocalAttributeValue
        } );
    }
}