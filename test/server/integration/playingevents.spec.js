/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('playing events', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'Melisandre (Core)', 'Seen In Flames'
            ]);
            const deck2 = this.buildDeck('martell', [
                'Trading with the Pentoshi',
                'The Hand\'s Judgment', 'Hedge Knight', 'Tower of the Sun', 'The Prince\'s Plan'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
            this.plan = this.player2.findCardByName('The Prince\'s Plan', 'hand');

            this.player1.clickCard('Melisandre', 'hand');
            this.player2.clickCard(this.knight);
            this.player2.clickCard('Tower of the Sun', 'hand');

            this.completeSetup();

            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.completeMarshalPhase();
        });

        describe('when playing an Action event', function() {
            beforeEach(function() {
                this.player1.clickCard('Seen In Flames');
                this.player2.clickPrompt('Pass');

                // Discard Hand's Judgment from the opponent's hand
                this.player2.clickPrompt('Yes');
                this.player1.clickPrompt('The Hand\'s Judgment');
            });

            it('should count as having played the event', function() {
                expect(this.player1).toHavePromptButton('Melisandre');

                this.player1.clickPrompt('Melisandre');
                this.player1.clickCard(this.knight);

                expect(this.knight.kneeled).toBe(true);
            });
        });

        describe('when cancelling the effects of an event', function() {
            beforeEach(function() {
                this.player1.clickCard('Seen In Flames');
                this.player2.clickPrompt('The Hand\'s Judgment');

                // Pass on Tower of the Sun
                this.player2.clickPrompt('Pass');
            });

            it('should still count as having played the event', function() {
                expect(this.player1).toHavePromptButton('Melisandre');

                this.player1.clickPrompt('Melisandre');
                this.player1.clickCard(this.knight);

                expect(this.knight.kneeled).toBe(true);
            });
        });

        describe('when a return-from-discard event ability triggers', function() {
            beforeEach(function() {
                this.player2.dragCard(this.plan, 'discard pile');

                this.player1.clickPrompt('Power');
                this.player1.clickCard('Melisandre', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('The Prince\'s Plan');
            });

            it('should not count as playing an event', function() {
                expect(this.player2).not.toHavePromptButton('Tower of the Sun');
            });
        });
    });
});
