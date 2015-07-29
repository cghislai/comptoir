import { Headers } from './headers';
import { ResponseTypes } from './enums';
import { IResponseOptions } from './interfaces';
/**
 * Creates a response options object similar to the
 * [ResponseInit](https://fetch.spec.whatwg.org/#responseinit) description
 * in the Fetch
 * Spec to be optionally provided when instantiating a
 * {@link Response}.
 *
 * All values are null by default.
 */
export declare class ResponseOptions implements IResponseOptions {
    body: string | Object;
    status: number;
    headers: Headers;
    statusText: string;
    type: ResponseTypes;
    url: string;
    constructor({body, status, headers, statusText, type, url}?: IResponseOptions);
    merge(options?: IResponseOptions): ResponseOptions;
}
/**
 * Injectable version of {@link ResponseOptions}, with overridable default values.
 */
export declare class BaseResponseOptions extends ResponseOptions {
    body: string | Object | ArrayBuffer | JSON | FormData | Blob;
    status: number;
    headers: Headers;
    statusText: string;
    type: ResponseTypes;
    url: string;
    constructor();
}
