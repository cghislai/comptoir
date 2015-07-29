import { DomProtoView } from './proto_view';
import { RenderViewRef, RenderEventDispatcher } from '../../api';
export declare function resolveInternalDomView(viewRef: RenderViewRef): DomView;
export declare class DomViewRef extends RenderViewRef {
    _view: DomView;
    constructor(_view: DomView);
}
/**
 * Const of making objects: http://jsperf.com/instantiate-size-of-object
 */
export declare class DomView {
    proto: DomProtoView;
    boundTextNodes: List<Node>;
    boundElements: Element[];
    hydrated: boolean;
    eventDispatcher: RenderEventDispatcher;
    eventHandlerRemovers: List<Function>;
    constructor(proto: DomProtoView, boundTextNodes: List<Node>, boundElements: Element[]);
    setElementProperty(elementIndex: number, propertyName: string, value: any): void;
    setElementAttribute(elementIndex: number, attributeName: string, value: string): void;
    setElementClass(elementIndex: number, className: string, isAdd: boolean): void;
    setElementStyle(elementIndex: number, styleName: string, value: string): void;
    invokeElementMethod(elementIndex: number, methodName: string, args: List<any>): void;
    setText(textIndex: number, value: string): void;
    dispatchEvent(elementIndex: number, eventName: string, event: Event): boolean;
}
