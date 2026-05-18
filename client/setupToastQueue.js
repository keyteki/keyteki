import { toastQueue } from '@heroui/react';

// HeroUI's default ToastQueue wraps every add/close/update in
// `document.startViewTransition(() => flushSync(fn))`. When toasts overlap
// (rapid successive add/close), Chrome aborts the in-flight transition and
// rejects its `.finished` / `.ready` promise with:
//   InvalidStateError: Transition was aborted because of invalid state
// HeroUI throws the ViewTransition away without catching, so the rejection
// escapes and is reported by Sentry's `onunhandledrejection` handler.
//
// Drop the `wrapUpdate` on the singleton's underlying react-stately queue so
// it falls back to the library default (plain `fn()` invocation, no view
// transitions). Toasts still appear and dismiss; the slide animation comes
// from heroui's CSS, not from the View Transitions API.
if (toastQueue?.queue) {
    toastQueue.queue.wrapUpdate = undefined;
}
