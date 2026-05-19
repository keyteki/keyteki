describe('GameWonPrompt', function () {
    beforeEach(function () {
        this.setupTest({
            player1: { house: 'untamed', inPlay: ['flaxia'] },
            player2: { house: 'shadows', inPlay: ['lamindra'] }
        });
        // The default test router does not stub the rematch entrypoints used
        // by the post-game prompt; stub them here.
        this.game.router.rematch = vi.fn();
        this.game.router.rematchWithNewDecks = vi.fn();

        // Trigger the post-game menu by having player1 concede; player2 wins.
        this.game.concede(this.player1.player.name);
        this.game.continue();
    });

    it('shows the continue + three rematch buttons by default', function () {
        const buttons = this.player1.currentButtons;
        expect(buttons).toContain('Continue Playing');
        expect(buttons).toContain('Rematch: Same Decks');
        expect(buttons).toContain('Rematch: Swap Decks');
        expect(buttons).toContain('Rematch: Change Decks');
    });

    it('hides the swap-decks button in adaptive-bo1', function () {
        this.game.gameFormat = 'adaptive-bo1';
        // Re-render the active prompt with the new format.
        this.game.continue();
        const buttons = this.player1.currentButtons;
        expect(buttons).toContain('Rematch: Same Decks');
        expect(buttons).not.toContain('Rematch: Swap Decks');
        expect(buttons).toContain('Rematch: Change Decks');
    });

    describe('rematch (same decks)', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Rematch: Same Decks');
        });

        it('prompts the opponent with Yes/No', function () {
            const buttons = this.player2.currentButtons;
            expect(buttons).toContain('Yes');
            expect(buttons).toContain('No');
        });

        it('shows the requester a Back button while waiting', function () {
            const prompt = this.player1.currentPrompt();
            expect(prompt.menuTitle).toBe('Waiting for opponent to agree to rematch');
            expect(this.player1.currentButtons).toContain('Back');
        });

        it('starts the rematch when the opponent agrees', function () {
            const initialSwap = this.game.swap;
            this.player2.clickPrompt('Yes');
            expect(this.game.router.rematch).toHaveBeenCalledWith(this.game);
            expect(this.game.router.rematchWithNewDecks).not.toHaveBeenCalled();
            // Same-decks mode must not toggle the swap flag.
            expect(this.game.swap).toBe(initialSwap);
        });

        it('returns both players to the full menu when the opponent declines', function () {
            this.player2.clickPrompt('No');
            expect(this.game.router.rematch).not.toHaveBeenCalled();
            expect(this.player1.currentButtons).toContain('Rematch: Same Decks');
            expect(this.player2.currentButtons).toContain('Rematch: Same Decks');
        });

        it('returns both players to the full menu when the requester clicks Back', function () {
            this.player1.clickPrompt('Back');
            expect(this.game.router.rematch).not.toHaveBeenCalled();
            expect(this.player1.currentButtons).toContain('Rematch: Same Decks');
            expect(this.player2.currentButtons).toContain('Rematch: Same Decks');
        });
    });

    describe('rematch (swap decks)', function () {
        it('toggles the swap flag when accepted', function () {
            this.game.swap = false;
            this.player1.clickPrompt('Rematch: Swap Decks');
            this.player2.clickPrompt('Yes');
            expect(this.game.router.rematch).toHaveBeenCalledWith(this.game);
            expect(this.game.swap).toBe(true);
        });

        it('toggles the swap flag back when invoked twice in a row', function () {
            this.game.swap = true;
            this.player1.clickPrompt('Rematch: Swap Decks');
            this.player2.clickPrompt('Yes');
            expect(this.game.swap).toBe(false);
        });
    });

    describe('rematch (change decks)', function () {
        it('routes to rematchWithNewDecks and clears swap', function () {
            this.game.swap = true;
            this.player1.clickPrompt('Rematch: Change Decks');
            this.player2.clickPrompt('Yes');
            expect(this.game.router.rematchWithNewDecks).toHaveBeenCalledWith(this.game);
            expect(this.game.router.rematch).not.toHaveBeenCalled();
            expect(this.game.swap).toBe(false);
        });
    });

    describe('continue', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Continue Playing');
        });

        it('prompts the opponent with Yes/No', function () {
            const buttons = this.player2.currentButtons;
            expect(buttons).toContain('Yes');
            expect(buttons).toContain('No');
        });

        it('shows the requester a Back button while waiting', function () {
            const prompt = this.player1.currentPrompt();
            expect(prompt.menuTitle).toBe('Waiting for opponent to agree to continue');
            expect(this.player1.currentButtons).toContain('Back');
        });

        it('dismisses the prompt and arms continuePlaying when the opponent agrees', function () {
            this.player2.clickPrompt('Yes');
            expect(this.game.continuePlaying).toBe(true);
            // The Game Won prompt should no longer be active for either player.
            const p1Buttons = this.player1.currentButtons || [];
            const p2Buttons = this.player2.currentButtons || [];
            expect(p1Buttons).not.toContain('Continue Playing');
            expect(p2Buttons).not.toContain('Continue Playing');
        });

        it('returns both players to the full menu when the opponent declines', function () {
            this.player2.clickPrompt('No');
            expect(this.game.continuePlaying).toBe(false);
            expect(this.player1.currentButtons).toContain('Continue Playing');
            expect(this.player2.currentButtons).toContain('Continue Playing');
        });

        it('returns both players to the full menu when the requester clicks Back', function () {
            this.player1.clickPrompt('Back');
            expect(this.game.continuePlaying).toBe(false);
            expect(this.player1.currentButtons).toContain('Continue Playing');
            expect(this.player2.currentButtons).toContain('Continue Playing');
        });

        it('reopens the post-game menu when a player concedes again after continuing', function () {
            this.player2.clickPrompt('Yes');
            expect(this.game.continuePlaying).toBe(true);

            this.game.concede(this.player1.player.name);
            this.game.continue();

            expect(this.player1.currentButtons).toContain('Continue Playing');
            expect(this.player1.currentButtons).toContain('Rematch: Same Decks');
            // The continuePlaying flag is consumed so it only re-opens once.
            expect(this.game.continuePlaying).toBe(false);
        });
    });

    describe('passive win checks after a win is recorded', function () {
        it('does not re-record or re-queue the post-game prompt', function () {
            // Player2 already won by concede in the outer beforeEach. The
            // Game Won prompt is currently active; running checkWinCondition
            // should be a no-op (no duplicate win, no new prompt queued).
            const wins = this.player2.player.wins;
            this.game.checkWinCondition();
            this.game.continue();
            expect(this.player2.player.wins).toBe(wins);
            // Still on the original Game Won prompt.
            expect(this.player1.currentButtons).toContain('Rematch: Same Decks');
        });
    });
});
