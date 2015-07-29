/**
 * Acceptable origin modes to be associated with a {@link Request}, based on
 * [RequestMode](https://fetch.spec.whatwg.org/#requestmode) from the Fetch spec.
 */
export declare enum RequestModesOpts {
    Cors = 0,
    NoCors = 1,
    SameOrigin = 2,
}
/**
 * Acceptable cache option to be associated with a {@link Request}, based on
 * [RequestCache](https://fetch.spec.whatwg.org/#requestcache) from the Fetch spec.
 */
export declare enum RequestCacheOpts {
    Default = 0,
    NoStore = 1,
    Reload = 2,
    NoCache = 3,
    ForceCache = 4,
    OnlyIfCached = 5,
}
/**
 * Acceptable credentials option to be associated with a {@link Request}, based on
 * [RequestCredentials](https://fetch.spec.whatwg.org/#requestcredentials) from the Fetch spec.
 */
export declare enum RequestCredentialsOpts {
    Omit = 0,
    SameOrigin = 1,
    Include = 2,
}
/**
 * Supported http methods.
 */
export declare enum RequestMethods {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    OPTIONS = 4,
    HEAD = 5,
    PATCH = 6,
}
export declare class RequestMethodsMap {
    private _methods;
    constructor();
    getMethod(method: int): string;
}
/**
 * All possible states in which a connection can be, based on
 * [States](http://www.w3.org/TR/XMLHttpRequest/#states) from the `XMLHttpRequest` spec, but with an
 * additional "CANCELLED" state.
 */
export declare enum ReadyStates {
    UNSENT = 0,
    OPEN = 1,
    HEADERS_RECEIVED = 2,
    LOADING = 3,
    DONE = 4,
    CANCELLED = 5,
}
/**
 * Acceptable response types to be associated with a {@link Response}, based on
 * [ResponseType](https://fetch.spec.whatwg.org/#responsetype) from the Fetch spec.
 */
export declare enum ResponseTypes {
    Basic = 0,
    Cors = 1,
    Default = 2,
    Error = 3,
    Opaque = 4,
}
