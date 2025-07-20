"use client"

// react/hooks.tsx
// Implements basic useState and useEffect hooks, and manages global state for the Fiber tree.

import type { Fiber, Hook } from "./types"
import { setNextUnitOfWork } from "./schedule"

// Global state variables, managed via getters/setters for controlled access.
let _hookIndex = 0 // Tracks the current hook being processed for a fiber
let _workInProgressRoot: Fiber | undefined = undefined // The fiber tree currently being built
let _currentRoot: Fiber | undefined = undefined // The fiber tree that was last committed to the DOM
let _deletions: Fiber[] = [] // List of fibers to be removed from the DOM

// Provides controlled access to the global hook index.
export function getHookIndex() {
    return {
        get: () => _hookIndex,
        increment: () => _hookIndex++,
        reset: () => (_hookIndex = 0),
    }
}

// Provides controlled access to the work-in-progress root and deletions array.
export function getWorkInProgressRoot() {
    return {
        get: () => _workInProgressRoot!,
        set: (fiber: Fiber | undefined) => (_workInProgressRoot = fiber),
        deletions: _deletions, // Expose deletions array
        resetDeletions: () => (_deletions = []), // Clear deletions for a new render cycle
    }
}

// Provides controlled access to the current committed root.
export function getCurrentRoot() {
    return {
        get: () => _currentRoot!,
        set: (fiber: Fiber | undefined) => (_currentRoot = fiber),
    }
}

// Implements a basic useState hook, similar to Didact.
export function useState<T>(initial: T): [T, (action: T | ((prevState: T) => T)) => void] {
    const currentRoot = getCurrentRoot().get()
    const workInProgressRoot = getWorkInProgressRoot().get()
    const hookIndex = getHookIndex().get()

    // Get the old hook state if it exists from the alternate fiber.
    const oldHook = currentRoot?.alternate?.hooks?.[hookIndex]
    const hook: Hook = {
        state: oldHook ? oldHook.state : initial,
        queue: [], // Queue for pending state updates
    }

    // Apply pending actions from the queue to update the state.
    const actions = oldHook ? oldHook.queue : []
    actions.forEach((action: any) => {
        hook.state = typeof action === "function" ? action(hook.state) : action
    })

    const setState = (action: T | ((prevState: T) => T)) => {
        hook.queue.push(action) // Add the action to the hook's queue
        // Trigger a re-render from the root to process the state update.
        // This creates a new work-in-progress root linked to the current committed root.
        getWorkInProgressRoot().set({
            dom: currentRoot!.dom,
            props: currentRoot!.props,
            alternate: currentRoot,
        })
        setNextUnitOfWork(getWorkInProgressRoot().get()) // Set the new root as the next unit of work
        getWorkInProgressRoot().resetDeletions() // Clear deletions for the new render cycle
    }

    workInProgressRoot!.hooks!.push(hook) // Add the hook to the current work-in-progress fiber
    getHookIndex().increment() // Move to the next hook index
    return [hook.state, setState]
}

// A simplified useEffect hook. In a full Fiber implementation, effects would be
// collected and run after the commit phase, with proper cleanup.
export function useEffect(callback: () => void, deps: any[]) {
    // For this basic example, we just run the callback once on mount.
    // A more complete implementation would involve storing effects on the fiber
    // and comparing dependencies to decide when to re-run or clean up.
    if (typeof window !== "undefined") {
        setTimeout(callback, 0) // Defer execution to avoid blocking render
    }
}
