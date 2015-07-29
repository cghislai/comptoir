import { Parser } from 'angular2/change_detection';
import { ViewDefinition } from '../../api';
import { CompileStep } from './compile_step';
import { ShadowDomStrategy } from '../shadow_dom/shadow_dom_strategy';
export declare class CompileStepFactory {
    createSteps(view: ViewDefinition): List<CompileStep>;
}
export declare class DefaultStepFactory extends CompileStepFactory {
    _parser: Parser;
    _shadowDomStrategy: ShadowDomStrategy;
    constructor(_parser: Parser, _shadowDomStrategy: ShadowDomStrategy);
    createSteps(view: ViewDefinition): List<CompileStep>;
}
