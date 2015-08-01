import { PathRecognizer } from './path_recognizer';
export declare class RouteParams {
    params: StringMap<string, string>;
    constructor(params: StringMap<string, string>);
    get(param: string): string;
}
/**
 * An `Instruction` represents the component hierarchy of the application based on a given route
 */
export declare class Instruction {
    component: any;
    capturedUrl: string;
    private _recognizer;
    child: Instruction;
    private _params;
    accumulatedUrl: string;
    reuse: boolean;
    specificity: number;
    constructor(component: any, capturedUrl: string, _recognizer: PathRecognizer, child?: Instruction, _params?: StringMap<string, any>);
    params(): StringMap<string, string>;
}
