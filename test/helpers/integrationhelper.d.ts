declare module jasmine {
    interface Matchers {
        toHavePrompt(expected: string): boolean;
        toBeAbleToSelect(expected: object): boolean;
        toHaveRecentChatMessage(expected: string): boolean;
        toHavePrompt(expected: string): boolean;
        toHavePromptButton(expected: string | number): boolean;
        toBeAbleToPlay(expected: object): boolean;
        toHavePromptCardButton(expected: object): boolean;
    }
}
