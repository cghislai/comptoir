import { PathRecognizer } from './path_recognizer';
import { RouteDefinition } from './route_config_impl';
/**
 * `RouteRecognizer` is responsible for recognizing routes for a single component.
 * It is consumed by `RouteRegistry`, which knows how to recognize an entire hierarchy of
 * components.
 */
export declare class RouteRecognizer {
    isRoot: boolean;
    names: Map<string, PathRecognizer>;
    redirects: Map<string, string>;
    matchers: Map<RegExp, PathRecognizer>;
    constructor(isRoot?: boolean);
    config(config: RouteDefinition): boolean;
    /**
     * Given a URL, returns a list of `RouteMatch`es, which are partial recognitions for some route.
     *
     */
    recognize(url: string): List<RouteMatch>;
    hasRoute(name: string): boolean;
    generate(name: string, params: any): StringMap<string, any>;
}
export declare class RouteMatch {
    recognizer: PathRecognizer;
    matchedUrl: string;
    unmatchedUrl: string;
    private _params;
    private _paramsParsed;
    constructor(recognizer: PathRecognizer, matchedUrl: string, unmatchedUrl: string, p?: StringMap<string, any>);
    params(): StringMap<string, any>;
}
