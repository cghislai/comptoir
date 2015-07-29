import { Type } from 'angular2/src/facade/lang';
import { GetterFn, SetterFn, MethodFn } from './types';
import { PlatformReflectionCapabilities } from 'platform_reflection_capabilities';
export declare class ReflectionCapabilities implements PlatformReflectionCapabilities {
    private _reflect;
    constructor(reflect?: any);
    isReflectionEnabled(): boolean;
    factory(t: Type): Function;
    _zipTypesAndAnnotaions(paramTypes: any, paramAnnotations: any): List<List<any>>;
    parameters(typeOfFunc: Type): List<List<any>>;
    annotations(typeOfFunc: Type): List<any>;
    interfaces(type: Type): List<any>;
    getter(name: string): GetterFn;
    setter(name: string): SetterFn;
    method(name: string): MethodFn;
}
