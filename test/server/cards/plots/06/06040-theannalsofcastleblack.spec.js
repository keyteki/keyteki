/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Annals of Castle Black', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'The Annals of Castle Black', 'A Noble Cause',
                'Wildling Horde', 'Lannisport Merchant', 'Hear Me Roar!'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Wildling Horde', 'hand');

            this.completeSetup();

            this.eventCard = this.player1.findCardByName('Hear Me Roar!', 'hand');
            this.character = this.player1.findCardByName('Lannisport Merchant', 'hand');
            this.opponentEventCard = this.player2.findCardByName('Hear Me Roar!', 'hand');
        });

        describe('when playing an event from hand', function() {
            beforeEach(function() {
                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();

                this.player1.clickCard(this.eventCard);
                this.player1.clickCard(this.character);
            });

            it('should allow the event to trigger', function() {
                expect(this.character.location).toBe('play area');
            });

            it('should remove the event from the game', function() {
                expect(this.eventCard.location).toBe('out of game');
            });
        });

        describe('when playing an event from discard pile', function() {
            beforeEach(function() {
                this.player1Object.moveCard(this.eventCard, 'discard pile');

                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();

                this.player1.clickCard(this.eventCard);
                expect(this.player1).toHavePrompt('Select character');
                this.player1.clickCard(this.character);
            });

            it('should allow the event to trigger', function() {
                expect(this.character.location).toBe('play area');
            });

            it('should remove the event from the game', function() {
                expect(this.eventCard.location).toBe('out of game');
            });
        });

        describe('when an event is discarded', function() {
            beforeEach(function() {
                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();

                this.player1.dragCard(this.eventCard, 'discard pile');
            });

            it('should remove the event from the game', function() {
                expect(this.eventCard.location).toBe('out of game');
            });
        });

        describe('when an event is discarded through pillage', function() {
            beforeEach(function() {
                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.skipActionWindow();

                this.player2Object.moveCard(this.opponentEventCard, 'draw deck');

                this.completeMarshalPhase();

                this.skipActionWindow();

                this.player1.clickPrompt('Power');
                this.player1.clickCard('Wildling Horde', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should remove the event from the game', function() {
                expect(this.opponentEventCard.location).toBe('out of game');
            });
        });
    });
});
