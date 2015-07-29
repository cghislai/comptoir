import { LocationStrategy } from './location_strategy';
import { OpaqueToken } from 'angular2/di';
export declare const appBaseHrefToken: OpaqueToken;
/**
 * This is the service that an application developer will directly interact with.
 *
 * Responsible for normalizing the URL against the application's base href.
 * A normalized URL is absolute from the URL host, includes the application's base href, and has no
 * trailing slash:
 * - `/my/app/user/123` is normalized
 * - `my/app/user/123` **is not** normalized
 * - `/my/app/user/123/` **is not** normalized
 */
export declare class Location {
    _platformStrategy: LocationStrategy;
    private _subject;
    private _baseHref;
    constructor(_platformStrategy: LocationStrategy, href?: string);
    _onPopState(_: any): void;
    path(): string;
    normalize(url: string): string;
    normalizeAbsolutely(url: string): string;
    _stripBaseHref(url: string): string;
    _addBaseHref(url: string): string;
    go(url: string): void;
    forward(): void;
    back(): void;
    subscribe(onNext: (value: any) => void, onThrow?: (exception: any) => void, onReturn?: () => void): void;
}
