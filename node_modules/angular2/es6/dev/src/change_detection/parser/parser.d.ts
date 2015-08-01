import { Lexer, Token } from './lexer';
import { Reflector } from 'angular2/src/reflection/reflection';
import { AST, BindingPipe, LiteralMap, TemplateBinding, ASTWithSource } from './ast';
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
export declare class _ParseAST {
    input: string;
    location: any;
    tokens: List<any>;
    reflector: Reflector;
    parseAction: boolean;
    index: int;
    constructor(input: string, location: any, tokens: List<any>, reflector: Reflector, parseAction: boolean);
    peek(offset: int): Token;
    next: Token;
    inputIndex: int;
    advance(): void;
    optionalCharacter(code: int): boolean;
    optionalKeywordVar(): boolean;
    peekKeywordVar(): boolean;
    expectCharacter(code: int): void;
    optionalOperator(op: string): boolean;
    expectOperator(operator: string): void;
    expectIdentifierOrKeyword(): string;
    expectIdentifierOrKeywordOrString(): string;
    parseChain(): AST;
    parseSimpleBinding(): AST;
    parsePipe(): AST;
    parseExpression(): AST;
    parseConditional(): AST;
    parseLogicalOr(): AST;
    parseLogicalAnd(): AST;
    parseEquality(): AST;
    parseRelational(): AST;
    parseAdditive(): AST;
    parseMultiplicative(): AST;
    parsePrefix(): AST;
    parseCallChain(): AST;
    parsePrimary(): AST;
    parseExpressionList(terminator: int): List<any>;
    parseLiteralMap(): LiteralMap;
    parseAccessMemberOrMethodCall(receiver: AST, isSafe?: boolean): AST;
    parseCallArguments(): BindingPipe[];
    parseExpressionOrBlock(): AST;
    parseBlockContent(): AST;
    /**
     * An identifier, a keyword, a string with an optional `-` inbetween.
     */
    expectTemplateBindingKey(): string;
    parseTemplateBindings(): any[];
    error(message: string, index?: int): void;
}
