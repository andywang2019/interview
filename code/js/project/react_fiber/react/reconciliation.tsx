// react/reconciliation.tsx
// Handles the reconciliation process (diffing old and new fibers), similar to Didact.

import type { Fiber, Element } from "./types"
import { PLACEMENT, UPDATE, DELETION } from "./constants"
import { createDom, createTextElement } from "./utils" // Import createTextElement
import { getHookIndex, getWorkInProgressRoot, getCurrentRoot } from "./hooks" // Import necessary functions from hooks
import { setNextUnitOfWork } from "./schedule" // Corrected import path for setNextUnitOfWork

// Reconciles children of a given fiber with new elements.
export function reconcileChildren(wipFiber: Fiber, elements: Element[]) {
    let index = 0
    let oldFiber = wipFiber.alternate?.child // Get the child from the old fiber tree
    let prevSibling: Fiber | undefined = undefined

    while (index < elements.length || oldFiber != null) {
        const element = elements[index]
        let newFiber: Fiber | undefined = undefined
        const sameType = oldFiber && element && element.type === oldFiber.type

        if (sameType) {
            // UPDATE: Type is the same, reuse the DOM node and update props.
            newFiber = {
                type: oldFiber!.type,
                props: element!.props,
                dom: oldFiber!.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: UPDATE,
                instance: oldFiber!.instance, // Carry over instance for class components
            }
        }
        if (element && !sameType) {
            // PLACEMENT: New element, different type, or no old fiber. Create new DOM node.
            newFiber = {
                type: element.type,
                props: element.props,
                dom: undefined, // Will be created in commit phase
                parent: wipFiber,
                alternate: undefined,
                effectTag: PLACEMENT,
            }
        }
        if (oldFiber && !sameType) {
            // DELETION: Old fiber exists but no corresponding new element or different type. Mark for deletion.
            oldFiber.effectTag = DELETION
            getWorkInProgressRoot().deletions.push(oldFiber)
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling // Move to the next sibling in the old tree
        }

        if (newFiber) {
            if (index === 0) {
                wipFiber.child = newFiber
            } else if (prevSibling) {
                prevSibling.sibling = newFiber
            }
            prevSibling = newFiber
        }
        index++
    }
}

// Updates a function component fiber.
export function updateFunctionComponent(fiber: Fiber) {
    getHookIndex().reset() // Reset hook index for this component before rendering
    fiber.hooks = [] // Initialize hooks array for this fiber

    const result = (fiber.type as Function)(fiber.props) // Call the function component to get its children

    // Ensure all children are Element objects (including TEXT_ELEMENT for strings/numbers)
    const children = Array.isArray(result)
        ? result.map((child) => (typeof child === "object" && child !== null ? child : createTextElement(String(child))))
        : [typeof result === "object" && result !== null ? result : createTextElement(String(result))]

    reconcileChildren(fiber, children as Element[]) // Reconcile the children
}

// Updates a class component fiber.
export function updateClassComponent(fiber: Fiber) {
    let instance = fiber.instance

    if (!instance) {
        // First time rendering this class component
        instance = fiber.instance = new (fiber.type as any)(fiber.props)
        // Initialize state from constructor or default to empty object
        instance.state = instance.state || {}
    } else {
        // Re-rendering, update props
        instance.props = fiber.props
        // Carry over state from the alternate instance if it exists
        instance.state = fiber.alternate?.instance?.state || instance.state
    }

    // Override setState to trigger Fiber updates
    instance.updater = (updater: any) => {
        const newState = typeof updater === "function" ? updater(instance.state) : updater
        instance.state = { ...instance.state, ...newState }

        // Trigger re-render from the root
        getWorkInProgressRoot().set({
            dom: getCurrentRoot().get().dom,
            props: getCurrentRoot().get().props,
            alternate: getCurrentRoot().get(),
        })
        setNextUnitOfWork(getWorkInProgressRoot().get())
        getWorkInProgressRoot().resetDeletions()
    }

    const children = [instance.render()] // Call render method to get children
    reconcileChildren(fiber, children as Element[])
}

// Updates a host component (e.g., div, p, button) fiber.
export function updateHostComponent(fiber: Fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber) // Create DOM node if it doesn't exist
    }
    reconcileChildren(fiber, fiber.props.children as Element[]) // Reconcile its children
}
