import { Type } from 'angular2/src/facade/lang';
import { SetterFn, GetterFn, MethodFn } from './types';
import { PlatformReflectionCapabilities } from './platform_reflection_capabilities';
export { SetterFn, GetterFn, MethodFn } from './types';
export { PlatformReflectionCapabilities } from './platform_reflection_capabilities';
export declare class ReflectionInfo {
    _factory: Function;
    _annotations: List<any>;
    _parameters: List<List<any>>;
    _interfaces: List<any>;
    constructor(annotations?: List<any>, parameters?: List<List<any>>, factory?: Function, interfaces?: List<any>);
}
export declare class Reflector {
    _injectableInfo: Map<any, ReflectionInfo>;
    _getters: Map<string, GetterFn>;
    _setters: Map<string, SetterFn>;
    _methods: Map<string, MethodFn>;
    reflectionCapabilities: PlatformReflectionCapabilities;
    constructor(reflectionCapabilities: PlatformReflectionCapabilities);
    isReflectionEnabled(): boolean;
    registerFunction(func: Function, funcInfo: ReflectionInfo): void;
    registerType(type: Type, typeInfo: ReflectionInfo): void;
    registerGetters(getters: StringMap<string, GetterFn>): void;
    registerSetters(setters: StringMap<string, SetterFn>): void;
    registerMethods(methods: StringMap<string, MethodFn>): void;
    factory(type: Type): Function;
    parameters(typeOrFunc: any): List<any>;
    annotations(typeOrFunc: any): List<any>;
    interfaces(type: Type): List<any>;
    getter(name: string): GetterFn;
    setter(name: string): SetterFn;
    method(name: string): MethodFn;
    _containsReflectionInfo(typeOrFunc: any): boolean;
}
