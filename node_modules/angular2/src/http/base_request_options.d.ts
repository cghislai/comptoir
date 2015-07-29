import { Headers } from './headers';
import { RequestModesOpts, RequestMethods, RequestCacheOpts, RequestCredentialsOpts } from './enums';
import { IRequestOptions } from './interfaces';
/**
 * Creates a request options object similar to the `RequestInit` description
 * in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#requestinit) to be optionally provided when instantiating a
 * {@link Request}.
 *
 * All values are null by default.
 */
export declare class RequestOptions implements IRequestOptions {
    /**
     * Http method with which to execute the request.
     *
     * Defaults to "GET".
     */
    method: RequestMethods;
    /**
     * Headers object based on the `Headers` class in the [Fetch
     * Spec](https://fetch.spec.whatwg.org/#headers-class).
     */
    headers: Headers;
    /**
     * Body to be used when creating the request.
     */
    body: string;
    mode: RequestModesOpts;
    credentials: RequestCredentialsOpts;
    cache: RequestCacheOpts;
    url: string;
    constructor({method, headers, body, mode, credentials, cache, url}?: IRequestOptions);
    /**
     * Creates a copy of the `RequestOptions` instance, using the optional input as values to override
     * existing values.
     */
    merge(options?: IRequestOptions): RequestOptions;
}
/**
 * Injectable version of {@link RequestOptions}, with overridable default values.
 *
 * #Example
 *
 * ```
 * import {Http, BaseRequestOptions, Request} from 'angular2/http';
 * ...
 * class MyComponent {
 *   constructor(baseRequestOptions:BaseRequestOptions, http:Http) {
 *     var options = baseRequestOptions.merge({body: 'foobar', url: 'https://foo'});
 *     var request = new Request(options);
 *     http.request(request).subscribe(res => this.bars = res.json());
 *   }
 * }
 *
 * ```
 */
export declare class BaseRequestOptions extends RequestOptions {
    constructor();
}
