/**
 * Polyfill for [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers), as
 * specified in the [Fetch Spec](https://fetch.spec.whatwg.org/#headers-class). The only known
 * difference from the spec is the lack of an `entries` method.
 */
export declare class Headers {
    _headersMap: Map<string, List<string>>;
    constructor(headers?: Headers | StringMap<string, any>);
    /**
     * Appends a header to existing list of header values for a given header name.
     */
    append(name: string, value: string): void;
    /**
     * Deletes all header values for the given name.
     */
    delete(name: string): void;
    forEach(fn: Function): void;
    /**
     * Returns first header that matches given name.
     */
    get(header: string): string;
    /**
     * Check for existence of header by given name.
     */
    has(header: string): boolean;
    /**
     * Provides names of set headers
     */
    keys(): List<string>;
    /**
     * Sets or overrides header value for given name.
     */
    set(header: string, value: string | List<string>): void;
    /**
     * Returns values of all headers.
     */
    values(): List<List<string>>;
    /**
     * Returns list of header values for a given name.
     */
    getAll(header: string): Array<string>;
    /**
     * This method is not implemented.
     */
    entries(): void;
}
