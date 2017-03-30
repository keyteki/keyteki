/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('The Lord of the Crossing', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('baratheon', [
                'The Lord of the Crossing',
                'A Noble Cause',
                'Selyse Baratheon', 'Bastard in Hiding', 'Fiery Followers'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.selyse = this.player1.findCardByName('Selyse Baratheon', 'hand');
            this.bastard = this.player1.findCardByName('Bastard in Hiding', 'hand');
            this.followers = this.player1.findCardByName('Fiery Followers', 'hand');

            this.player1.clickCard(this.selyse);
            this.player1.clickCard(this.bastard);
            this.player1.clickCard(this.followers);

            this.completeSetup();

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('on challenge 1', function() {
            beforeEach(function() {
                this.skipActionWindow();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
            });

            it('should reduce the strength of attacking characters by 1', function() {
                expect(this.followers.getStrength()).toBe(1);
            });
        });

        describe('on challenge 2', function() {
            beforeEach(function() {
                this.skipActionWindow();
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.selyse);
                this.player1.clickPrompt('Done');
            });

            it('should not modify the strength of attacking characters', function() {
                expect(this.selyse.getStrength()).toBe(2);
            });
        });

        describe('on challenge 3', function() {
            beforeEach(function() {
                this.skipActionWindow();
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.followers);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.selyse);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.bastard);
                this.player1.clickPrompt('Done');
            });

            it('should increase the strength of attacking characters by 2', function() {
                expect(this.bastard.getStrength()).toBe(4);
            });

            describe('when the player wins', function() {
                beforeEach(function() {
                    this.skipActionWindow();
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();
                    this.skipActionWindow();
                });

                it('should grant power when the won', function() {
                    // 3 from unopposed challenges, 1 from LotC
                    expect(this.player1Object.getTotalPower()).toBe(4);
                });
            });
        });
    });
});
