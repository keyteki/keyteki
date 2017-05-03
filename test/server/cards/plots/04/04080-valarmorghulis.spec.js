/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Valar Morghulis', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('tyrell', [
                'Valar Morghulis',
                'Margaery Tyrell (AMAF)', 'Margaery Tyrell (AMAF)', 'Rickon Stark', 'Eddard Stark (Core)'
            ]);
            const deck2 = this.buildDeck('thenightswatch', [
                'A Noble Cause',
                'Samwell Tarly (Core)', 'Maester Aemon (Core)'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            [this.marg1, this.marg2] = this.player1.filterCardsByName('Margaery Tyrell', 'hand');
            this.rickon = this.player1.findCardByName('Rickon Stark', 'hand');
            this.eddard = this.player1.findCardByName('Eddard Stark', 'hand');

            this.samwell = this.player2.findCardByName('Samwell Tarly', 'hand');
            this.aemon = this.player2.findCardByName('Maester Aemon', 'hand');

            this.player1.clickCard(this.marg1);
            this.player1.clickCard(this.marg2);
            this.player1.clickCard(this.rickon);

            this.player2.clickCard(this.samwell);
            this.player2.clickCard(this.aemon);

            this.completeSetup();

            this.player1Object.moveCard(this.eddard, 'draw deck');

            this.player1.selectPlot('Valar Morghulis');
            this.player2.selectPlot('A Noble Cause');

            this.selectFirstPlayer(this.player1);
        });

        it('should prompt interrupts and reactions in the proper order', function() {
            expect(this.player1).not.toHavePromptButton('Margaery Tyrell');
            expect(this.player2).toHavePromptButton('Maester Aemon');

            // Aemon saves Sam but dies
            this.player2.clickPrompt('Maester Aemon');
            this.player2.clickCard('Samwell Tarly', 'play area');
            expect(this.samwell.location).toBe('play area');
            expect(this.aemon.location).toBe('dead pile');

            // Marg's dupe saves her but Rickon dies
            expect(this.marg1.location).toBe('play area');
            expect(this.marg2.location).toBe('discard pile');
            expect(this.rickon.location).toBe('dead pile');

            expect(this.player1).toHavePromptButton('Margaery Tyrell');
        });
    });
});
