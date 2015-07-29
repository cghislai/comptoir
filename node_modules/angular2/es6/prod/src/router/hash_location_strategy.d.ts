import { LocationStrategy } from './location_strategy';
export declare class HashLocationStrategy extends LocationStrategy {
    private _location;
    private _history;
    constructor();
    onPopState(fn: EventListener): void;
    getBaseHref(): string;
    path(): string;
    pushState(state: any, title: string, url: string): void;
    forward(): void;
    back(): void;
}
