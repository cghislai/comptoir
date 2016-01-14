/**
 * Created by cghislai on 09/08/15.
 */
import {OpaqueToken} from 'angular2/core';

/**
 * This interface is to be implemented by the config json
 * located at @See(SERVICE_CONFIG_URL)
 */
export interface ServiceConfig {
    comptoirWsUrl: string;
}

/**
 * The location of the json file implementing ServiceConfig
 * @type {string}
 */
export const SERVICE_CONFIG_URL = "servicesConfig.json";

export const COMPTOIR_SERVICE_URL: OpaqueToken = new OpaqueToken('services url');
