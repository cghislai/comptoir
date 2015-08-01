import { Parser } from 'angular2/src/change_detection/change_detection';
import { ViewDefinition } from '../../api';
import { CompileStep } from './compile_step';
export declare class CompileStepFactory {
    createSteps(view: ViewDefinition): List<CompileStep>;
}
export declare class DefaultStepFactory extends CompileStepFactory {
    private _parser;
    private _appId;
    private _componentUIDsCache;
    constructor(_parser: Parser, _appId: string);
    createSteps(view: ViewDefinition): List<CompileStep>;
}
