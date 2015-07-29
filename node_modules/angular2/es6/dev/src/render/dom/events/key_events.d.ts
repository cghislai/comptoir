import { EventManagerPlugin } from './event_manager';
import { NgZone } from 'angular2/src/core/zone/ng_zone';
export declare class KeyEventsPlugin extends EventManagerPlugin {
    constructor();
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: (Event: any) => any, shouldSupportBubble: boolean): void;
    static parseEventName(eventName: string): StringMap<string, string>;
    static getEventFullKey(event: Event): string;
    static eventCallback(element: HTMLElement, shouldSupportBubble: boolean, fullKey: any, handler: (Event) => any, zone: NgZone): (event: Event) => void;
    static _normalizeKey(keyName: string): string;
}
