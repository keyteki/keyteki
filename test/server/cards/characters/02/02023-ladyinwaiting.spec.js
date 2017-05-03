/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Lady-in-Waiting', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Lady-in-Waiting', 'Margaery Tyrell (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.ladyInWaiting = this.player1.findCardByName('Lady-in-Waiting');
            this.margaery = this.player1.findCardByName('Margaery Tyrell');
        });

        describe('when there is no Lady character out', function() {
            beforeEach(function() {
                this.player1.clickCard('Lady-in-Waiting', 'hand');
            });

            it('should marshal as normal', function() {
                expect(this.ladyInWaiting.location).toBe('play area');
            });

            it('should cost the normal amount of gold', function() {
                // 5 gold from plot - 2 for LiW.
                expect(this.player1Object.gold).toBe(3);
            });
        });

        describe('when there is Lady character out', function() {
            beforeEach(function() {
                this.player1.clickCard('Margaery Tyrell', 'hand');
                this.player1.clickCard('Lady-in-Waiting', 'hand');
            });

            it('should not put Lady in Waiting into play immediately', function() {
                expect(this.ladyInWaiting.location).toBe('hand');
            });

            it('should prompt whether to marshal as a dupe', function() {
                expect(this.player1).toHavePrompt('Play Lady-in-Waiting:');
            });

            describe('and the player chooses to marshal as a dupe', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Marshal as dupe');
                    this.player1.clickCard('Margaery Tyrell', 'play area');
                });

                it('should add it as a dupe', function() {
                    expect(this.ladyInWaiting.location).toBe('duplicate');
                    expect(this.margaery.dupes.size()).toBe(1);
                    expect(this.margaery.dupes).toContain(this.ladyInWaiting);
                });

                it('should not cost any gold', function() {
                    // 5 gold from plot - 1 from Margaery - 0 for LiW.
                    expect(this.player1Object.gold).toBe(4);
                });
            });
        });
    });
});
