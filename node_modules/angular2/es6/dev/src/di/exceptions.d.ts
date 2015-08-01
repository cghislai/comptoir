import { BaseException } from 'angular2/src/facade/lang';
import { Key } from './key';
import { Injector } from './injector';
/**
 * Base class for all errors arising from misconfigured bindings.
 */
export declare class AbstractBindingError extends BaseException {
    name: string;
    message: string;
    keys: List<Key>;
    injectors: List<Injector>;
    constructResolvingMessage: Function;
    constructor(injector: Injector, key: Key, constructResolvingMessage: Function, originalException?: any, originalStack?: any);
    addKey(injector: Injector, key: Key): void;
    context: any;
    toString(): string;
}
/**
 * Thrown when trying to retrieve a dependency by `Key` from {@link Injector}, but the
 * {@link Injector} does not have a {@link Binding} for {@link Key}.
 */
export declare class NoBindingError extends AbstractBindingError {
    constructor(injector: Injector, key: Key);
}
/**
 * Thrown when dependencies form a cycle.
 *
 * ## Example:
 *
 * ```javascript
 * class A {
 *   constructor(b:B) {}
 * }
 * class B {
 *   constructor(a:A) {}
 * }
 * ```
 *
 * Retrieving `A` or `B` throws a `CyclicDependencyError` as the graph above cannot be constructed.
 */
export declare class CyclicDependencyError extends AbstractBindingError {
    constructor(injector: Injector, key: Key);
}
/**
 * Thrown when a constructing type returns with an Error.
 *
 * The `InstantiationError` class contains the original error plus the dependency graph which caused
 * this object to be instantiated.
 */
export declare class InstantiationError extends AbstractBindingError {
    causeKey: Key;
    constructor(injector: Injector, originalException: any, originalStack: any, key: Key);
}
/**
 * Thrown when an object other then {@link Binding} (or `Type`) is passed to {@link Injector}
 * creation.
 */
export declare class InvalidBindingError extends BaseException {
    message: string;
    constructor(binding: any);
    toString(): string;
}
/**
 * Thrown when the class has no annotation information.
 *
 * Lack of annotation information prevents the {@link Injector} from determining which dependencies
 * need to be injected into the constructor.
 */
export declare class NoAnnotationError extends BaseException {
    name: string;
    message: string;
    constructor(typeOrFunc: any, params: List<List<any>>);
    toString(): string;
}
/**
 * Thrown when getting an object by index.
 */
export declare class OutOfBoundsError extends BaseException {
    message: string;
    constructor(index: any);
    toString(): string;
}
