import { RequestMethods, RequestModesOpts, RequestCredentialsOpts, RequestCacheOpts } from './enums';
import { RequestOptions } from './base_request_options';
import { Headers } from './headers';
/**
 * Creates `Request` instances from provided values.
 *
 * The Request's interface is inspired by the Request constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#request-class),
 * but is considered a static value whose body can be accessed many times. There are other
 * differences in the implementation, but this is the most significant.
 */
export declare class Request {
    /**
     * Http method with which to perform the request.
     *
     * Defaults to GET.
     */
    method: RequestMethods;
    mode: RequestModesOpts;
    credentials: RequestCredentialsOpts;
    /**
     * Headers object based on the `Headers` class in the [Fetch
     * Spec](https://fetch.spec.whatwg.org/#headers-class). {@link Headers} class reference.
     */
    headers: Headers;
    /** Url of the remote resource */
    url: string;
    private _body;
    cache: RequestCacheOpts;
    constructor(requestOptions: RequestOptions);
    /**
     * Returns the request's body as string, assuming that body exists. If body is undefined, return
     * empty
     * string.
     */
    text(): String;
}
