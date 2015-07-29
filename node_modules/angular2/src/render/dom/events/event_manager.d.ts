import { NgZone } from 'angular2/src/core/zone/ng_zone';
export declare class EventManager {
    _plugins: List<EventManagerPlugin>;
    _zone: NgZone;
    constructor(_plugins: List<EventManagerPlugin>, _zone: NgZone);
    addEventListener(element: HTMLElement, eventName: string, handler: Function): void;
    addGlobalEventListener(target: string, eventName: string, handler: Function): Function;
    getZone(): NgZone;
    _findPluginFor(eventName: string): EventManagerPlugin;
    _removeBubbleSymbol(eventName: string): string;
}
export declare class EventManagerPlugin {
    manager: EventManager;
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: Function, shouldSupportBubble: boolean): void;
    addGlobalEventListener(element: string, eventName: string, handler: Function, shouldSupportBubble: boolean): Function;
}
export declare class DomEventsPlugin extends EventManagerPlugin {
    manager: EventManager;
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: Function, shouldSupportBubble: boolean): void;
    addGlobalEventListener(target: string, eventName: string, handler: Function, shouldSupportBubble: boolean): Function;
    _getOutsideHandler(shouldSupportBubble: boolean, element: HTMLElement, handler: Function, zone: NgZone): (event: Event) => void;
    static sameElementCallback(element: HTMLElement, handler: Function, zone: NgZone): (event: Event) => void;
    static bubbleCallback(element: HTMLElement, handler: Function, zone: NgZone): (event: Event) => void;
}
