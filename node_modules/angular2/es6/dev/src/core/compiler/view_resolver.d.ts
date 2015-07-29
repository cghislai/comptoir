import { View } from 'angular2/src/core/annotations_impl/view';
import { Type } from 'angular2/src/facade/lang';
export declare class ViewResolver {
    _cache: Map<Type, any>;
    resolve(component: Type): View;
    _resolve(component: Type): View;
}
