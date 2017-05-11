/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('effects', function() {
    integration(function() {
        describe('when blanking / unblanking a dynamically calculated conditional effect', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'Sneak Attack',
                    'Jhogo', 'Hedge Knight', 'Nightmares'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.jhogo = this.player1.findCardByName('Jhogo', 'hand');

                this.player1.clickCard(this.jhogo);
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Move a character to the opponent's dead pile so Jhogo gets a
                // strength boost
                let character = this.player2.findCardByName('Hedge Knight', 'hand');
                this.player2.dragCard(character, 'dead pile');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.jhogo);
                this.player1.clickPrompt('Done');

                expect(this.jhogo.getStrength()).toBe(4);

                this.player1.clickPrompt('Done');
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(this.jhogo);
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.jhogo.getStrength()).toBe(3);

                // Declare no defenders
                this.player2.clickPrompt('Done');

                this.skipActionWindow();
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
            });

            it('should not crash when the blank wears off', function() {
                expect(() => {
                    // Complete challenges, so that Nightmares wears off.
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');
                }).not.toThrow();
            });
        });

        describe('when/until phase ends vs at end of phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Sneak Attack', 'Winter Festival',
                    'Eddard Stark (WotN)', 'Tyene Sand'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Eddard Stark', 'hand');

                this.player1.clickCard(this.character);
                this.player2.clickCard('Tyene Sand', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Winter Festival');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                // Explicitly set power to 13 so that Winter Festival will win the game
                this.character.power = 13;

                this.completeMarshalPhase();

                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Intrigue');
                this.player2.clickCard('Tyene Sand');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Tyene Sand');
                this.player2.clickCard(this.character);

                expect(this.character.tokens['poison']).toBeTruthy();

                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');

                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Winter Festival');
            });

            it('should apply when/until effects before at the end of phase effects', function() {
                // Since Winter Festival should have brought Player 1's total
                // power up to 15 just before the character dies, a winner should
                // be recorded.
                expect(this.game.winner).toBe(this.player1Object);
                expect(this.character.location).toBe('dead pile');
                expect(this.player1Object.getTotalPower()).toBe(2);
            });
        });
    });
});
