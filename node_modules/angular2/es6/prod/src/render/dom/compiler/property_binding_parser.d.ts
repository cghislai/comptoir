import { Parser } from 'angular2/src/change_detection/change_detection';
import { CompileStep } from './compile_step';
import { CompileElement } from './compile_element';
import { CompileControl } from './compile_control';
/**
 * Parses the property bindings on a single element.
 */
export declare class PropertyBindingParser implements CompileStep {
    private _parser;
    constructor(_parser: Parser);
    processStyle(style: string): string;
    processElement(parent: CompileElement, current: CompileElement, control: CompileControl): void;
    _normalizeAttributeName(attrName: string): string;
    _bindVariable(identifier: any, value: any, current: CompileElement, newAttrs: Map<any, any>): void;
    _bindProperty(name: any, expression: any, current: CompileElement, newAttrs: any): void;
    _bindPropertyAst(name: any, ast: any, current: CompileElement, newAttrs: Map<any, any>): void;
    _bindAssignmentEvent(name: any, expression: any, current: CompileElement, newAttrs: any): void;
    _bindEvent(name: any, expression: any, current: CompileElement, newAttrs: any): void;
}
