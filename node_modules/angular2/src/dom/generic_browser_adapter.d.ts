import { DomAdapter } from './dom_adapter';
/**
 * Provides DOM operations in any browser environment.
 */
export declare class GenericBrowserDomAdapter extends DomAdapter {
    getDistributedNodes(el: HTMLElement): List<Node>;
    resolveAndSetHref(el: HTMLAnchorElement, baseUrl: string, href: string): void;
    cssToRules(css: string): List<any>;
    supportsDOMEvents(): boolean;
    supportsNativeShadowDOM(): boolean;
}
