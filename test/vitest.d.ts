import 'vitest';

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
