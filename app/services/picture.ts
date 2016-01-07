/**
 * Created by cghislai on 06/08/15.
 */
import {Inject} from 'angular2/core';

import {LocalPicture, LocalPictureFactory} from '../client/localDomain/picture';
import {PictureClient, Picture, PictureRef, PictureSearch} from '../client/domain/picture';

import {BasicClient} from '../client/utils/basicClient';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {BasicLocalService, BasicLocalServiceInfo} from './basicService';
import {AuthService} from './auth';

export class PictureService extends BasicLocalService<Picture, LocalPicture> {


    constructor(@Inject(AuthService) authService:AuthService) {
        var client = new PictureClient();
        super(<BasicLocalServiceInfo<Picture, LocalPicture>>{
            client: client,
            authService: authService,
            fromLocalConverter: LocalPictureFactory.fromLocalPicture,
            toLocalConverter: LocalPictureFactory.toLocalPicture
        } );
    }

}