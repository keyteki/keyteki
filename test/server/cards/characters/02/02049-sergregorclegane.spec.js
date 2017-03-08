/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Ser Gregor Clegane', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Ser Gregor Clegane'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'Sneak Attack',
                'Hedge Knight', 'Maester Cressen', 'Hedge Knight', 'Shireen Baratheon', 'The Roseroad'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Ser Gregor Clegane', 'hand');
            this.player2.clickCard('Hedge Knight', 'hand');
            this.player2.clickCard('Shireen Baratheon', 'hand');
            this.completeSetup();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('Sneak Attack');
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();

            this.shireen = this.player2.findCardByName('Shireen Baratheon', 'play area');
            this.roseroad = this.player2.findCardByName('The Roseroad', 'hand');
            this.cressen = this.player2.findCardByName('Maester Cressen', 'hand');
            this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
        });

        describe('when a non-character is pillaged', function() {
            beforeEach(function() {
                this.roseroad.controller.moveCard(this.roseroad, 'draw deck');
                this.unopposedChallenge(this.player1, 'Military', 'Ser Gregor Clegane');
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard('Hedge Knight', 'play area');
            });

            it('should discard as normal', function() {
                expect(this.roseroad.location).toBe('discard pile');
            });

            it('should not prompt to kill', function() {
                expect(this.player1).not.toHavePrompt('Select a character to kill');
            });
        });

        describe('when a character is pillaged that has a killable cost', function() {
            beforeEach(function() {
                this.knight.controller.moveCard(this.knight, 'draw deck');
                this.unopposedChallenge(this.player1, 'Military', 'Ser Gregor Clegane');
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player1.clickPrompt('Yes');
            });

            it('should put the character into the dead pile', function() {
                expect(this.knight.location).toBe('dead pile');
            });

            it('should prompt to kill', function() {
                expect(this.player1).toHavePrompt('Select a character to kill');
            });

            it('should allow the player to kill an equal cost character', function() {
                this.player1.clickCard(this.shireen);
                this.player2.clickPrompt('No');

                expect(this.shireen.location).toBe('dead pile');
            });
        });

        describe('when a character is pillaged that does not have a killable cost', function() {
            beforeEach(function() {
                this.cressen.controller.moveCard(this.cressen, 'draw deck');
                this.unopposedChallenge(this.player1, 'Military', 'Ser Gregor Clegane');
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player1.clickPrompt('Yes');
            });

            it('should put the character into the dead pile', function() {
                expect(this.cressen.location).toBe('dead pile');
            });

            it('should not prompt to kill', function() {
                expect(this.player1).not.toHavePrompt('Select a character to kill');
            });
        });
    });
});
