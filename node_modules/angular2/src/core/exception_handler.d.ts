/**
 * Provides a hook for centralized exception handling.
 *
 * The default implementation of `ExceptionHandler` prints error messages to the `Console`. To
 * intercept error handling,
 * write a custom exception handler that replaces this default as appropriate for your app.
 *
 * # Example
 *
 * ```javascript
 *
 * class MyExceptionHandler implements ExceptionHandler {
 *   call(error, stackTrace = null, reason = null) {
 *     // do something with the exception
 *   }
 * }
 *
 * bootstrap(MyApp, [bind(ExceptionHandler).toClass(MyExceptionHandler)])
 *
 * ```
 */
export declare class ExceptionHandler {
    private logger;
    private rethrowException;
    constructor(logger: any, rethrowException?: boolean);
    static exceptionToString(exception: any, stackTrace?: any, reason?: string): string;
    call(exception: any, stackTrace?: any, reason?: string): void;
    _longStackTrace(stackTrace: any): any;
    _findContext(exception: any): any;
    _findOriginalException(exception: any): any;
    _findOriginalStack(exception: any): any;
}
