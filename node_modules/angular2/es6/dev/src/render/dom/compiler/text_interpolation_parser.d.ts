import { Parser } from 'angular2/src/change_detection/change_detection';
import { CompileStep } from './compile_step';
import { CompileElement } from './compile_element';
import { CompileControl } from './compile_control';
/**
 * Parses interpolations in direct text child nodes of the current element.
 */
export declare class TextInterpolationParser implements CompileStep {
    _parser: Parser;
    constructor(_parser: Parser);
    processStyle(style: string): string;
    processElement(parent: CompileElement, current: CompileElement, control: CompileControl): void;
}
