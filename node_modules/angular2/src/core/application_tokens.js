'use strict';var di_1 = require('angular2/di');
var lang_1 = require('angular2/src/facade/lang');
/**
 *  @private
 */
exports.appComponentRefPromiseToken = lang_1.CONST_EXPR(new di_1.OpaqueToken('Promise<ComponentRef>'));
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
exports.appComponentTypeToken = lang_1.CONST_EXPR(new di_1.OpaqueToken('RootComponent'));
//# sourceMappingURL=application_tokens.js.map