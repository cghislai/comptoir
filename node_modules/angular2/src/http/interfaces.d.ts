/// <reference path="../../../../../angular2/typings/rx/rx.d.ts" />
import { ReadyStates, RequestModesOpts, RequestMethods, RequestCacheOpts, RequestCredentialsOpts, ResponseTypes } from './enums';
import { Headers } from './headers';
import { EventEmitter } from 'angular2/src/facade/async';
import { Request } from './static_request';
/**
 * Abstract class from which real backends are derived.
 *
 * The primary purpose of a `ConnectionBackend` is to create new connections to fulfill a given
 * {@link Request}.
 */
export declare class ConnectionBackend {
    constructor();
    createConnection(request: any): Connection;
}
/**
 * Abstract class from which real connections are derived.
 */
export declare class Connection {
    readyState: ReadyStates;
    request: Request;
    response: EventEmitter;
    dispose(): void;
}
/**
 * Interface for options to construct a Request, based on
 * [RequestInit](https://fetch.spec.whatwg.org/#requestinit) from the Fetch spec.
 */
export interface IRequestOptions {
    url?: string;
    method?: RequestMethods;
    headers?: Headers;
    body?: string;
    mode?: RequestModesOpts;
    credentials?: RequestCredentialsOpts;
    cache?: RequestCacheOpts;
}
/**
 * Interface for options to construct a Response, based on
 * [ResponseInit](https://fetch.spec.whatwg.org/#responseinit) from the Fetch spec.
 */
export interface IResponseOptions {
    body?: string | Object | FormData;
    status?: number;
    statusText?: string;
    headers?: Headers;
    type?: ResponseTypes;
    url?: string;
}
