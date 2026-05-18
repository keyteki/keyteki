import { TouchBackend } from 'react-dnd-touch-backend';

// Wraps react-dnd-touch-backend's TouchBackend to guard against a known race in
// v16.0.1: when a drag source unmounts (e.g. a Card re-renders because of an
// incoming gamestate update) between mousedown/touchstart and the first
// move event, the backend's cached `moveStartSourceIds` references handler
// ids that the registry no longer knows about. dnd-core's beginDrag then
// trips `Invariant Violation: Expected sourceIds to be registered.` and the
// throw escapes as an unhandled error from a document `mousemove` listener.
//
// The wrapper filters `moveStartSourceIds` against the live registry on every
// move event, dropping unregistered ids before they reach `beginDrag`. If no
// valid ids remain, `moveStartSourceIds` is cleared so the move is treated as
// "not a drag start", matching the behaviour before the source disappeared.
export const SafeTouchBackend = (manager, context, options) => {
    const backend = TouchBackend(manager, context, options);
    const registry = manager.getRegistry();
    const originalHandleTopMove = backend.handleTopMove;

    backend.handleTopMove = (event) => {
        if (Array.isArray(backend.moveStartSourceIds)) {
            const valid = backend.moveStartSourceIds.filter((id) => registry.getSource(id));
            backend.moveStartSourceIds = valid.length > 0 ? valid : undefined;
        }
        return originalHandleTopMove(event);
    };

    return backend;
};
