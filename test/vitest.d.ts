/// <reference types="vitest/globals" />

export {};

type VitestDescribe = typeof import('vitest')['describe'];
type VitestIt = typeof import('vitest')['it'];
type VitestBeforeEach = typeof import('vitest')['beforeEach'];
type VitestAfterEach = typeof import('vitest')['afterEach'];

declare global {
    interface globalThis {
        describe: VitestDescribe;
        it: VitestIt;
        beforeEach: VitestBeforeEach;
        afterEach: VitestAfterEach;
    }
}

interface CustomMatchers<R = unknown> {
    toHavePrompt(expected: string): R;
    toHavePromptImage(expected: string): R;
    toHavePromptButton(expected: string): R;
    toHavePromptCardButton(card: any): R;
    toBeAbleToRaiseTide(): R;
    toBeAbleToSelect(card: any): R;
    toBeAbleToPlay(card: any): R;
    toHaveRecentChatMessage(msg: string, numBack?: number): R;
    isReadyToTakeAction(): R;
}

declare module 'vitest' {
    interface Assertion<T = any> extends CustomMatchers<T> {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
}
