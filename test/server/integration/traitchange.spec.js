/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('trait change', function() {
    integration(function() {
        describe('effect recalculation', function() {
            beforeEach(function() {
                const deck = this.buildDeck('martell', [
                    'A Tourney for the King',
                    'Arianne Martell', 'Knighted'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Arianne Martell', 'hand');
                this.knighted = this.player1.findCardByName('Knighted', 'hand');

            });

            describe('when gaining a trait after the effect has come into play', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.character);
                    this.completeSetup();

                    this.player1.selectPlot('A Tourney for the King');
                    this.player2.selectPlot('A Tourney for the King');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickCard(this.knighted);
                    this.player1.clickCard(this.character);
                    expect(this.character.hasTrait('Knight')).toBe(true);

                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Intrigue', this.character);
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should apply the effect to the character', function() {
                    // Renown from A Tourney for the King
                    expect(this.character.power).toBe(1);
                });
            });

            describe('when losing a trait after the effect has come into play', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.character);
                    this.player1.clickCard(this.knighted);
                    this.completeSetup();

                    this.player1.clickCard(this.knighted);
                    this.player1.clickCard(this.character);

                    expect(this.character.hasTrait('Knight')).toBe(true);

                    this.player1.selectPlot('A Tourney for the King');
                    this.player2.selectPlot('A Tourney for the King');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.player1.dragCard(this.knighted, 'discard pile');
                    expect(this.character.hasTrait('Knight')).toBe(false);

                    this.unopposedChallenge(this.player1, 'Intrigue', this.character);
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should not apply the effect to the character', function() {
                    // No renown from A Tourney for the King since no longer a Knight
                    expect(this.character.power).toBe(0);
                });
            });
        });
    });
});
