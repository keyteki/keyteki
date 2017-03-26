/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('pillage', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'Wildling Horde', 'Wildling Horde'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.skipSetupPhase();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.player1.clickPrompt('player1');

            [this.wildlingHorde1, this.wildlingHorde2] = this.player1.filterCardsByName('Wildling Horde');

            this.player1.clickCard(this.wildlingHorde1);
            this.player1.clickCard(this.wildlingHorde2);
            this.completeMarshalPhase();

            // Return cards to deck
            this.player2Object.hand.each(card => {
                this.player2Object.moveCard(card, 'draw deck');
            });
        });

        describe('when more than one pillage occurs', function() {
            beforeEach(function() {
                this.skipActionWindow();
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.wildlingHorde1);
                this.player1.clickCard(this.wildlingHorde2);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should discard two cards', function() {
                expect(this.player2Object.drawDeck.size()).toBe(0);
                expect(this.player2Object.discardPile.size()).toBe(2);
            });
        });

    });
});
