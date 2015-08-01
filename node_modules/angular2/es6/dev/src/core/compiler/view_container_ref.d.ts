import { ResolvedBinding } from 'angular2/di';
import * as avmModule from './view_manager';
import { ElementRef } from './element_ref';
import { TemplateRef } from './template_ref';
import { ViewRef, HostViewRef, ProtoViewRef } from './view_ref';
/**
 * A location where {@link ViewRef}s can be attached.
 *
 * A `ViewContainerRef` represents a location in a {@link ViewRef} where other child
 * {@link ViewRef}s can be inserted. Adding and removing views is the only way of structurally
 * changing the rendered DOM of the application.
 */
export declare class ViewContainerRef {
    viewManager: avmModule.AppViewManager;
    element: ElementRef;
    /**
     * @private
     */
    constructor(viewManager: avmModule.AppViewManager, element: ElementRef);
    private _getViews();
    /**
     * Remove all {@link ViewRef}s at current location.
     */
    clear(): void;
    /**
     * Return a {@link ViewRef} at specific index.
     */
    get(index: number): ViewRef;
    /**
     * Returns number of {@link ViewRef}s currently attached at this location.
     */
    length: number;
    /**
     * Create and insert a {@link ViewRef} into the view-container.
     *
     * - `protoViewRef` (optional) {@link ProtoViewRef} - The `ProtoView` to use for creating
     *   `View` to be inserted at this location. If `ViewContainer` is created at a location
     *   of inline template, then `protoViewRef` is the `ProtoView` of the template.
     * - `atIndex` (optional) `number` - location of insertion point. (Or at the end if unspecified.)
     * - `context` (optional) {@link ElementRef} - Context (for expression evaluation) from the
     *   {@link ElementRef} location. (Or current context if unspecified.)
     * - `bindings` (optional) Array of {@link ResolvedBinding} - Used for configuring
     *   `ElementInjector`.
     *
     * Returns newly created {@link ViewRef}.
     */
    createEmbeddedView(templateRef: TemplateRef, atIndex?: number): ViewRef;
    createHostView(protoViewRef?: ProtoViewRef, atIndex?: number, dynamicallyCreatedBindings?: ResolvedBinding[]): HostViewRef;
    /**
     * Insert a {@link ViewRef} at specefic index.
     *
     * The index is location at which the {@link ViewRef} should be attached. If omitted it is
     * inserted at the end.
     *
     * Returns the inserted {@link ViewRef}.
     */
    insert(viewRef: ViewRef, atIndex?: number): ViewRef;
    /**
     * Return the index of already inserted {@link ViewRef}.
     */
    indexOf(viewRef: ViewRef): number;
    /**
     * Remove a {@link ViewRef} at specific index.
     *
     * If the index is omitted last {@link ViewRef} is removed.
     */
    remove(atIndex?: number): void;
    /**
     * The method can be used together with insert to implement a view move, i.e.
     * moving the dom nodes while the directives in the view stay intact.
     */
    detach(atIndex?: number): ViewRef;
}
