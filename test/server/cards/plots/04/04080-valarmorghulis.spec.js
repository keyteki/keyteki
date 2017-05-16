/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Valar Morghulis', function() {
    integration(function() {
        describe('when there are both interrupts and reactions to dying', function() {
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

        describe('when multiple characters die', function() {
            beforeEach(function() {
                const deck = this.buildDeck('tyrell', [
                    'Valar Morghulis', 'A Noble Cause',
                    'Arya Stark (Core)', 'Arya Stark (Core)', 'Hedge Knight', 'House Maester'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                // Put out dupes for player 1's Arya so only 1 character will be
                // killed.
                this.player1.clickCard('Arya Stark', 'hand');
                this.player1.clickCard('Arya Stark', 'hand');
                this.player1.clickCard('Hedge Knight', 'hand');

                // Put out no dupes for player 2 so multiple characters will be
                // killed.
                this.deadArya = this.player2.findCardByName('Arya Stark', 'hand');
                this.deadKnight = this.player2.findCardByName('Hedge Knight', 'hand');
                this.deadMaester = this.player2.findCardByName('House Maester', 'hand');
                this.player2.clickCard(this.deadArya);
                this.player2.clickCard(this.deadKnight);
                this.player2.clickCard(this.deadMaester);

                this.completeSetup();

                this.player1.selectPlot('Valar Morghulis');
                this.player2.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player1);
            });

            it('should not prompt to choose dead pile order if only one character will die', function() {
                expect(this.player1).not.toHavePrompt('Select order to place cards in dead pile (top first)');
            });

            it('should prompt to choose dead pile order for multiple characters', function() {
                expect(this.player2).toHavePrompt('Select order to place cards in dead pile (top first)');
            });

            it('should allow dead pile order to be chosen', function() {
                // Top of dead pile to bottom of dead pile.
                this.player2.clickCard(this.deadMaester);
                this.player2.clickCard(this.deadArya);
                this.player2.clickCard(this.deadKnight);
                this.player2.clickPrompt('Done');

                expect(this.player2Object.deadPile.pluck('name')).toEqual(['Hedge Knight', 'Arya Stark', 'House Maester']);
            });
        });
    });
});
