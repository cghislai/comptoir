/**
 * Map-like representation of url search parameters, based on
 * [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams) in the url living standard.
 *
 */
export declare class URLSearchParams {
    rawParams: string;
    paramsMap: Map<string, List<string>>;
    constructor(rawParams: string);
    has(param: string): boolean;
    get(param: string): string;
    getAll(param: string): List<string>;
    append(param: string, val: string): void;
    toString(): string;
    delete(param: string): void;
}
