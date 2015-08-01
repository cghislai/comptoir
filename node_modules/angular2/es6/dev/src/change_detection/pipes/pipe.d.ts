import { ChangeDetectorRef } from '../change_detector_ref';
/**
 * Indicates that the result of a {@link Pipe} transformation has changed even though the reference
 * has not changed.
 *
 * The wrapped value will be unwrapped by change detection, and the unwrapped value will be stored.
 */
export declare class WrappedValue {
    wrapped: any;
    constructor(wrapped: any);
    static wrap(value: any): WrappedValue;
}
/**
 * An interface which all pipes must implement.
 *
 * #Example
 *
 * ```
 * class DoublePipe implements Pipe {
 *  supports(obj) {
 *    return true;
 *  }
 *
 *  onDestroy() {}
 *
 *  transform(value, args = []) {
 *    return `${value}${value}`;
 *  }
 * }
 * ```
 */
export interface Pipe {
    /**
     * Query if a pipe supports a particular object instance.
     */
    supports(obj: any): boolean;
    onDestroy(): void;
    transform(value: any, args: List<any>): any;
}
/**
 * Provides default implementation of `supports` and `onDestroy` method.
 *
 * #Example
 *
 * ```
 * class DoublePipe extends BasePipe {
 *  transform(value) {
 *    return `${value}${value}`;
 *  }
 * }
 * ```
 */
export declare class BasePipe implements Pipe {
    supports(obj: any): boolean;
    onDestroy(): void;
    transform(value: any, args: List<any>): any;
}
/**
 *
 */
export interface PipeFactory {
    supports(obs: any): boolean;
    create(cdRef: ChangeDetectorRef): Pipe;
}
