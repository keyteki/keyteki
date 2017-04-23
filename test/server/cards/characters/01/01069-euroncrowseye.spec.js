/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Euron Crow\'s Eye', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'Sneak Attack',
                'Euron Crow\'s Eye', 'The Arbor'
            ]);
            const deck2 = this.buildDeck('tyrell', [
                'Sneak Attack',
                'The Arbor', 'The Arbor'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Euron Crow\'s Eye', 'hand');
            this.completeSetup();
            this.player1.selectPlot('Sneak Attack');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            this.ourArbor = this.player1.findCardByName('The Arbor', 'hand');
            [this.theirArbor1, this.theirArbor2] = this.player2.filterCardsByName('The Arbor', 'hand');
        });

        describe('when there are no locations in discard', function() {
            beforeEach(function() {
                this.completeMarshalPhase();
                this.unopposedChallenge(this.player1, 'power', 'Euron Crow\'s Eye');
                this.player1.clickPrompt('Apply Claim');
            });

            it('should not prompt', function() {
                expect(this.player1).not.toHavePromptButton('Euron Crow\'s Eye');
            });
        });

        describe('when a locations would end up in discard', function() {
            beforeEach(function() {
                // Move one of the Arbors back to draw
                this.player2Object.moveCard(this.theirArbor2, 'draw deck');
            });

            describe('and the location is not in play already', function() {
                beforeEach(function() {
                    this.completeMarshalPhase();
                    this.unopposedChallenge(this.player1, 'power', 'Euron Crow\'s Eye');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should prompt', function() {
                    expect(this.player1).toHavePromptButton('Euron Crow\'s Eye');
                });

                it('should allow a location be put into play', function() {
                    this.player1.clickPrompt('Euron Crow\'s Eye');
                    this.player1.clickCard(this.theirArbor2);

                    expect(this.theirArbor2.location).toBe('play area');
                    expect(this.theirArbor2.controller).toBe(this.player1Object);
                });
            });

            describe('and the location is in play for the opponent', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');
                    this.player2.clickCard(this.theirArbor1);
                    this.player2.clickPrompt('Done');
                    this.unopposedChallenge(this.player1, 'power', 'Euron Crow\'s Eye');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should not prompt', function() {
                    expect(this.player1).not.toHavePromptButton('Euron Crow\'s Eye');
                });
            });

            describe('and the location is in play for the current player', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.ourArbor);
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');
                    this.unopposedChallenge(this.player1, 'power', 'Euron Crow\'s Eye');
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should not prompt', function() {
                    expect(this.player1).not.toHavePromptButton('Euron Crow\'s Eye');
                });
            });
        });
    });
});
