import { Type } from 'angular2/src/facade/lang';
import { DependencyMetadata } from 'angular2/src/di/metadata';
/**
 * Specifies that a constant attribute value should be injected.
 *
 * The directive can inject constant string literals of host element attributes.
 *
 * ## Example
 *
 * Suppose we have an `<input>` element and want to know its `type`.
 *
 * ```html
 * <input type="text">
 * ```
 *
 * A decorator can inject string literal `text` like so:
 *
 * ```javascript
 * @Directive({
 *   selector: `input'
 * })
 * class InputDirective {
 *   constructor(@Attribute('type') type) {
 *     // type would be `text` in this example
 *   }
 * }
 * ```
 */
export declare class Attribute extends DependencyMetadata {
    attributeName: string;
    constructor(attributeName: string);
    token: Attribute;
    toString(): string;
}
/**
 * Specifies that a {@link QueryList} should be injected.
 *
 * See {@link QueryList} for usage and example.
 */
export declare class Query extends DependencyMetadata {
    private _selector;
    descendants: boolean;
    constructor(_selector: Type | string, {descendants}?: {
        descendants?: boolean;
    });
    isViewQuery: boolean;
    selector: any;
    isVarBindingQuery: boolean;
    varBindings: List<string>;
    toString(): string;
}
/**
 * Specifies that a {@link QueryList} should be injected.
 *
 * See {@link QueryList} for usage and example.
 */
export declare class ViewQuery extends Query {
    constructor(_selector: Type | string, {descendants}?: {
        descendants?: boolean;
    });
    isViewQuery: boolean;
    toString(): string;
}
