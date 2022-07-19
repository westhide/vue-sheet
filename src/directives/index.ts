// withDirectives()

/**
 * customDirective = {
 *
 * // called before bound element's attributes or event listeners are applied
 *
 * created(el, binding, vnode, prevVnode) {
 *   // see below for details on arguments
 * },
 *
 * // called right before the element is inserted into the DOM.
 *
 * beforeMount() {},
 *
 * // called when the bound element's parent component and all its children are mounted.
 *
 * mounted() {},
 *
 * // called before the parent component is updated
 *
 * beforeUpdate() {},
 *
 * // called after the parent component and all of its children have updated
 *
 * updated() {},
 *
 * // called before the parent component is unmounted
 *
 * beforeUnmount() {},
 *
 * // called when the parent component is unmounted
 *
 * unmounted() {},
 * };
 */

/**
 * function withDirectives(vnode: VNode, directives: DirectiveArguments): VNode;
 *
 * // [Directive, value, argument, modifiers]
 *
 * type DirectiveArguments = Array<[Directive] | [Directive, any] | [Directive, any, string] | [Directive, any, string, DirectiveModifiers]>;
 */

export {};
