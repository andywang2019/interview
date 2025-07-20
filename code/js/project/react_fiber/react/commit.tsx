// commit.tsx
import type { Fiber } from "./types"
import { updateDom } from "./utils"
import { getCurrentRoot, getWorkInProgressRoot } from "./hooks"

export function commitRoot() {
    const workInProgressRoot = getWorkInProgressRoot().get()
    const deletions = getWorkInProgressRoot().deletions

    deletions.forEach(commitWork) // First, perform deletions
    commitWork(workInProgressRoot!.child) // Then, commit additions/updates
    getCurrentRoot().set(workInProgressRoot) // Set the new tree as the current committed tree
    getWorkInProgressRoot().set(undefined) // Clear work in progress root
    getWorkInProgressRoot().resetDeletions() // Clear deletions after commit
}

export function commitWork(fiber: Fiber | undefined) {
    if (!fiber) {
        return
    }

    let domParentFiber = fiber.parent
    while (domParentFiber && !domParentFiber.dom) {
        domParentFiber = domParentFiber.parent
    }
    const domParent = domParentFiber!.dom

    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        domParent!.appendChild(fiber.dom)
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate!.props, fiber.props)
    } else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent!)
        return // Don't continue to children if deleted
    }

    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

export function commitDeletion(fiber: Fiber, domParent: HTMLElement | Text) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom)
    } else {
        // If the fiber itself doesn't have a DOM node (e.g., a function component),
        // recursively find the first child with a DOM node to remove.
        commitDeletion(fiber.child!, domParent)
    }
}
