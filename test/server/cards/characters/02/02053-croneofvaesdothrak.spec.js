/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Crone of Vaes Dothrak', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('targaryen', [
                'A Noble Cause',
                'Crone of Vaes Dothrak', 'Braided Warrior', 'Black Wind\'s Crew'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Hedge Knight', 'Hedge Knight', 'The Roseroad', 'The Roseroad'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Crone of Vaes Dothrak', 'hand');
            this.player1.clickCard('Braided Warrior', 'hand');
            this.player1.clickCard('Black Wind\'s Crew', 'hand');
            this.completeSetup();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);
        });

        describe('when a card is discarded from the draw deck', function() {
            describe('when a character gets discarded', function() {
                beforeEach(function() {
                    // Move characters back to draw
                    this.player2Object.hand.each(card => {
                        if(card.getType() === 'character') {
                            this.player2Object.moveCard(card, 'draw deck');
                        }
                    });

                    this.completeMarshalPhase();
                    this.unopposedChallenge(this.player1, 'Power', 'Black Wind\'s Crew');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should move the opponent character into the dead pile', function() {
                    expect(this.player1).toHavePrompt('Trigger Crone of Vaes Dothrak?');
                    this.player1.clickPrompt('Yes');
                    this.player1.clickCard('Crone of Vaes Dothrak', 'play area');

                    expect(this.player2Object.discardPile.size()).toBe(0);
                    expect(this.player2Object.deadPile.size()).toBe(1);
                });
            });

            describe('when a non-character gets discarded', function() {
                beforeEach(function() {
                    // Move non-characters back to draw
                    this.player2Object.hand.each(card => {
                        if(card.getType() !== 'character') {
                            this.player2Object.moveCard(card, 'draw deck');
                        }
                    });

                    this.completeMarshalPhase();
                    this.unopposedChallenge(this.player1, 'Power', 'Black Wind\'s Crew');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should move the opponent character into the discard pile', function() {
                    expect(this.player1).not.toHavePrompt('Trigger Crone of Vaes Dothrak?');
                    expect(this.player2Object.discardPile.size()).toBe(1);
                    expect(this.player2Object.deadPile.size()).toBe(0);
                });
            });
        });

        describe('when a card is discarded from hand', function() {
            describe('when a character gets discarded', function() {
                beforeEach(function() {
                    // Move non-characters back to draw
                    this.player2Object.hand.each(card => {
                        if(card.getType() !== 'character') {
                            this.player2Object.moveCard(card, 'draw deck');
                        }
                    });

                    this.completeMarshalPhase();
                    this.unopposedChallenge(this.player1, 'Intrigue', 'Crone of Vaes Dothrak');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should move the opponent character into the dead pile', function() {
                    expect(this.player1).toHavePrompt('Trigger Crone of Vaes Dothrak?');
                    this.player1.clickPrompt('Yes');
                    this.player1.clickCard('Braided Warrior', 'play area');

                    expect(this.player2Object.discardPile.size()).toBe(0);
                    expect(this.player2Object.deadPile.size()).toBe(1);
                });
            });

            describe('when a non-character gets discarded', function() {
                beforeEach(function() {
                    // Move characters back to draw
                    this.player2Object.hand.each(card => {
                        if(card.getType() === 'character') {
                            this.player2Object.moveCard(card, 'draw deck');
                        }
                    });

                    this.completeMarshalPhase();
                    this.unopposedChallenge(this.player1, 'Intrigue', 'Crone of Vaes Dothrak');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should move the opponent character into the discard pile', function() {
                    expect(this.player1).not.toHavePrompt('Trigger Crone of Vaes Dothrak?');
                    expect(this.player2Object.discardPile.size()).toBe(1);
                    expect(this.player2Object.deadPile.size()).toBe(0);
                });
            });
        });
    });
});
