/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Shield of Lannisport', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Shield of Lannisport', 'Tyrion Lannister (Core)', 'Cersei Lannister (Core)', 'Ser Lancel Lannister'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.tyrion = this.player1.findCardByName('Tyrion Lannister', 'hand');

            this.player1.clickCard(this.tyrion);
            this.completeSetup();

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.skipActionWindow();

            // Attach Shield to Tyrion
            this.player1.clickCard('Shield of Lannisport', 'hand');
            this.player1.clickCard(this.tyrion);
        });


        it('should grant +2 STR and renown', function() {
            expect(this.tyrion.getStrength()).toBe(6);
            expect(this.tyrion.hasKeyword('Renown')).toBe(true);
        });

        describe('when another Lord or Lady is in play', function() {
            describe('and they are of cost 4 or more', function() {
                beforeEach(function() {
                    this.player1.clickCard('Cersei Lannister', 'hand');
                });

                it('should remove the bonuses', function() {
                    expect(this.tyrion.getStrength()).toBe(4);
                    expect(this.tyrion.hasKeyword('Renown')).toBe(false);
                });
            });

            describe('and they are below cost 4', function() {
                beforeEach(function() {
                    this.player1.clickCard('Ser Lancel Lannister', 'hand');
                });

                it('should retain the bonuses', function() {
                    expect(this.tyrion.getStrength()).toBe(6);
                    expect(this.tyrion.hasKeyword('Renown')).toBe(true);
                });
            });
        });
    });
});
