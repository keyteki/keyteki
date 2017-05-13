/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Catelyn Stark', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('stark', [
                'Sneak Attack',
                'Catelyn Stark (Core)',
                'Septa Mordane'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Tyrion Lannister (Core)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Catelyn Stark (Core)', 'hand');
            this.player2.clickCard('Tyrion Lannister (Core)', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.player1.clickCard('Septa Mordane', 'hand');

            this.completeMarshalPhase();

            this.coreCat = this.player1.findCardByName('Catelyn Stark (Core)', 'play area');
        });

        describe('when core cat is not participating', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Intrigue');

                this.player1.clickCard('Septa Mordane', 'play area');
                this.player1.clickPrompt('Done');
            });

            it('should not prevent opponents card abilities', function() {
                expect(this.player2).toHavePromptButton('Tyrion Lannister');
            });
        });

        describe('when core cat is participating', function() {
            beforeEach(function() {
                this.player1.clickPrompt('Intrigue');

                this.player1.clickCard('Catelyn Stark (Core)', 'play area');
                this.player1.clickPrompt('Done');
            });

            it('should prevent opponents card abilities', function() {
                expect(this.player2).not.toHavePromptButton('Tyrion Lannister');
            });
        });
    });
});
