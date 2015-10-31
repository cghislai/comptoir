/**
 * Created by cghislai on 29/07/15.
 */

import {Inject} from 'angular2/angular2';

import {AttributeDefinition, AttributeDefinitionRef, AttributeDefinitionClient, AttributeDefinitionFactory} from '../client/domain/attributeDefinition';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicService, BasicServiceInfo} from './basicService';
import {AuthService} from './auth';


export class AttributeDefinitionService extends BasicService<AttributeDefinition> {

    constructor(@Inject authService:AuthService) {
        var client = new AttributeDefinitionClient();
        super({
            client: client,
            authService: authService
        } );
    }
}