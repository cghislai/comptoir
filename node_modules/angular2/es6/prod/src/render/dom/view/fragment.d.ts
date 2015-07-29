import { RenderFragmentRef } from '../../api';
export declare function resolveInternalDomFragment(fragmentRef: RenderFragmentRef): Node[];
export declare class DomFragmentRef extends RenderFragmentRef {
    _nodes: Node[];
    constructor(_nodes: Node[]);
}
