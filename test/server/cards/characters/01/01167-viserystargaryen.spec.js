/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Viserys Targaryen', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('targaryen', [
                'Sneak Attack',
                'Viserys Targaryen (Core)'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Feast for Crows',
                'Tumblestone Knight',
                'Lady'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Viserys Targaryen (Core)', 'hand');
            this.player2.clickCard('Tumblestone Knight', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('A Feast for Crows');
            this.selectFirstPlayer(this.player2);

            this.viserys = this.player1.findCardByName('Viserys Targaryen (Core)', 'play area');
            
            this.player2.clickCard('Lady');
            this.player2.clickCard('Tumblestone Knight');

            this.lady = this.player2.findCardByName('Lady', 'play area');

            this.completeMarshalPhase();
        });

        describe('when Viserys is killed', function() {
            beforeEach(function() {
                this.unopposedChallenge(this.player2, 'military', 'Tumblestone Knight');
                this.player2.clickPrompt('Apply Claim');

                this.player1.clickCard(this.viserys);
            });

            it('should allow the player to discard an attachment', function() {
                this.player1.clickPrompt('Viserys Targaryen');
                this.player1.clickCard(this.lady);

                expect(this.lady.parent).toBe(undefined);
            });
        });
    });
});
