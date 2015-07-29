import { RouteHandler } from './route_handler';
import { Type } from 'angular2/src/facade/lang';
export declare class AsyncRouteHandler implements RouteHandler {
    private _loader;
    _resolvedComponent: Promise<any>;
    componentType: Type;
    constructor(_loader: Function);
    resolveComponentType(): Promise<any>;
}
