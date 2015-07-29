import { OpaqueToken } from 'angular2/di';
/**
 *  @private
 */
export declare const appComponentRefPromiseToken: OpaqueToken;
/**
 * An opaque token representing the application root type in the {@link Injector}.
 *
 * ```
 * @Component(...)
 * @View(...)
 * class MyApp {
 *   ...
 * }
 *
 * bootstrap(MyApp).then((appRef:ApplicationRef) {
 *   expect(appRef.injector.get(appComponentTypeToken)).toEqual(MyApp);
 * });
 *
 * ```
 */
export declare const appComponentTypeToken: OpaqueToken;
