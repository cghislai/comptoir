import { Instruction } from './instruction';
/**
 * Defines route lifecycle method [onActivate]
 */
export interface OnActivate {
    onActivate(nextInstruction: Instruction, prevInstruction: Instruction): any;
}
/**
 * Defines route lifecycle method [onReuse]
 */
export interface OnReuse {
    onReuse(nextInstruction: Instruction, prevInstruction: Instruction): any;
}
/**
 * Defines route lifecycle method [onDeactivate]
 */
export interface OnDeactivate {
    onDeactivate(nextInstruction: Instruction, prevInstruction: Instruction): any;
}
/**
 * Defines route lifecycle method [canReuse]
 */
export interface CanReuse {
    canReuse(nextInstruction: Instruction, prevInstruction: Instruction): any;
}
/**
 * Defines route lifecycle method [canDeactivate]
 */
export interface CanDeactivate {
    canDeactivate(nextInstruction: Instruction, prevInstruction: Instruction): any;
}
