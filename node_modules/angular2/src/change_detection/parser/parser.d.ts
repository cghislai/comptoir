import { Lexer } from './lexer';
import { Reflector } from 'angular2/src/reflection/reflection';
import { TemplateBinding, ASTWithSource } from './ast';
export declare class Parser {
    _lexer: Lexer;
    _reflector: Reflector;
    constructor(_lexer: Lexer, providedReflector?: Reflector);
    parseAction(input: string, location: any): ASTWithSource;
    parseBinding(input: string, location: any): ASTWithSource;
    parseSimpleBinding(input: string, location: string): ASTWithSource;
    parseTemplateBindings(input: string, location: any): List<TemplateBinding>;
    parseInterpolation(input: string, location: any): ASTWithSource;
    wrapLiteralPrimitive(input: string, location: any): ASTWithSource;
}
