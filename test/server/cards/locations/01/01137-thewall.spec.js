/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('TheWall', function() {
    integration(function() {
        describe('when dupes are put out in the setup phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', ['The Wall', 'The Wall', 'Steward at the Wall']);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.wall1, this.wall2] = this.player1.filterCardsByName('The Wall');
                this.character = this.player1.findCardByName('Steward at the Wall');
            });

            it('should not count duplicates toward character strength', function() {
                this.player1.clickCard(this.wall1);
                this.player1.clickCard(this.wall2);
                this.player1.clickCard(this.character);

                this.completeSetup();

                expect(this.wall1.dupes.size()).toBe(1);
                expect(this.player1Object.cardsInPlay.size()).toBe(2);
                expect(this.character.getStrength()).toBe(2);
            });
        });
    });
});
