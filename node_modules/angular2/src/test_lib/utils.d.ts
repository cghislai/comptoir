export declare class Log {
    _result: List<any>;
    constructor();
    add(value: any): void;
    fn(value: any): (a1?: any, a2?: any, a3?: any, a4?: any, a5?: any) => void;
    result(): string;
}
export declare function dispatchEvent(element: any, eventType: any): void;
export declare function el(html: string): HTMLElement;
export declare function containsRegexp(input: string): RegExp;
export declare function normalizeCSS(css: string): string;
export declare function stringifyElement(el: any): string;
