// react/schedule.tsx
// Manages the work loop and scheduling, similar to Didact's main loop.

import type { Element, Fiber } from "./types"
import { updateFunctionComponent, updateClassComponent, updateHostComponent } from "./reconciliation.tsx" // Import all update functions
import { commitRoot } from "./commit"
import { getWorkInProgressRoot, getCurrentRoot } from "./hooks"

// Global variable for the next unit of work to be processed.
let nextUnitOfWork: Fiber | undefined = undefined

// Sets the next unit of work.
export function setNextUnitOfWork(fiber: Fiber | undefined) {
    nextUnitOfWork = fiber
}

// Sets the current committed root.
export function setCurrentRoot(fiber: Fiber | undefined) {
    getCurrentRoot().set(fiber)
}

// Sets the work-in-progress root.
export function setWorkInProgressRoot(fiber: Fiber | undefined) {
    getWorkInProgressRoot().set(fiber)
}

// The main render function, initiating the reconciliation process.
export function render(element: Element, container: HTMLElement) {
    console.log("schedule.tsx: Entering render function.") // Debug log 4
    // Create the initial work-in-progress root fiber.
    setWorkInProgressRoot({
        dom: container, // The container DOM node
        props: {
            children: [element], // The element to render as a child
        },
        alternate: getCurrentRoot().get(), // Link to the previous committed tree for diffing
    })
    getWorkInProgressRoot().resetDeletions() // Clear any pending deletions from previous cycles
    setNextUnitOfWork(getWorkInProgressRoot().get()) // Start the work loop with the new root
    console.log("schedule.tsx: render function finished setting up work.") // Debug log 5
}

// The work loop, scheduled with requestIdleCallback for cooperative multitasking.
export function workLoop(deadline: IdleDeadline) {
    let shouldYield = false
    // Continue processing units of work as long as there's work and time remaining.
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork) // Process one unit of work
        shouldYield = deadline.timeRemaining() < 1 // Check if we should yield to the browser
    }

    // If all work is done and there's a work-in-progress root, commit the changes to the DOM.
    if (!nextUnitOfWork && getWorkInProgressRoot().get()) {
        commitRoot()
    }

    // Request another idle callback if there's still work to do (or to continue the loop).
    requestIdleCallback(workLoop)
}

// Performs a single unit of work: building the fiber tree and reconciling children.
export function performUnitOfWork(fiber: Fiber): Fiber | undefined {
    console.log("--- schedule.tsx: performUnitOfWork Debug ---")
    console.log("Processing Fiber:", fiber)
    console.log("Fiber Type:", fiber.type)

    const isFunction = typeof fiber.type === "function"
    console.log("  Is typeof function:", isFunction)

    let isClassComponent = false
    if (isFunction && fiber.type.prototype) {
        // Check if the prototype or its immediate parent prototype has the isReactComponent marker
        // This handles both direct definition and inheritance.
        isClassComponent =
            Object.prototype.hasOwnProperty.call(fiber.type.prototype, "isReactComponent") ||
            (Object.getPrototypeOf(fiber.type.prototype) &&
                Object.prototype.hasOwnProperty.call(Object.getPrototypeOf(fiber.type.prototype), "isReactComponent"))

        console.log("  Fiber type prototype:", fiber.type.prototype)
        console.log("  isReactComponent marker value (raw):", (fiber.type.prototype as any).isReactComponent)
        console.log("  isClassComponent (evaluated from marker):", isClassComponent)
    } else if (isFunction) {
        console.log("  Fiber type is function, but prototype is null/undefined.")
    }

    const isFunctionComponent = isFunction && !isClassComponent // If it's a function and not a class component

    console.log("  Calculated isFunctionComponent:", isFunctionComponent)
    console.log("  Calculated isClassComponent:", isClassComponent)
    console.log("---------------------------------------------")

    if (isFunctionComponent) {
        updateFunctionComponent(fiber)
    } else if (isClassComponent) {
        updateClassComponent(fiber)
    } else {
        updateHostComponent(fiber)
    }

    // Return the next unit of work using a depth-first traversal.
    if (fiber.child) {
        return fiber.child // Go to child first
    }
    let nextFiber: Fiber | undefined = fiber
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling // Then to sibling
        }
        nextFiber = nextFiber.parent // Then back up to parent's sibling
    }
    return undefined // No more work in this branch
}

// Start the work loop when the window is available.
if (typeof window !== "undefined") {
    requestIdleCallback(workLoop)
}
