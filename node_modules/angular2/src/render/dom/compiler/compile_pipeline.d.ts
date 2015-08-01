import { CompileElement } from './compile_element';
import { CompileControl } from './compile_control';
import { CompileStep } from './compile_step';
import { ViewType, ViewDefinition } from '../../api';
/**
 * CompilePipeline for executing CompileSteps recursively for
 * all elements in a template.
 */
export declare class CompilePipeline {
    steps: List<CompileStep>;
    _control: CompileControl;
    constructor(steps: List<CompileStep>);
    processStyles(styles: string[]): string[];
    processElements(rootElement: Element, protoViewType: ViewType, viewDef: ViewDefinition): CompileElement[];
    _processElement(results: CompileElement[], parent: CompileElement, current: CompileElement, compilationCtxtDescription?: string): void;
}
