/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('reducer cards', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'Power Behind the Throne',
                'Winterfell Steward', 'Heart Tree Grove', 'Bran Stark'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.steward = this.player1.findCardByName('Winterfell Steward', 'hand');
            this.grove = this.player1.findCardByName('Heart Tree Grove', 'hand');

            this.player1.clickCard(this.steward);
            this.player1.clickCard(this.grove);
            this.completeSetup();

            this.player1.selectPlot('Power Behind the Throne');
            this.player2.selectPlot('Power Behind the Throne');
            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.selectPlotOrder(this.player1);

            this.skipActionWindow();
        });

        it('should allow reducers to activate', function() {
            this.player1.clickCard(this.grove);
            this.player1.clickCard('Bran Stark', 'hand');

            expect(this.player1Object.gold).toBe(2);
        });

        it('should allow reducers to stack', function() {
            this.player1.clickCard(this.grove);
            this.player1.clickCard(this.steward);
            this.player1.clickCard('Bran Stark', 'hand');

            expect(this.player1Object.gold).toBe(3);
        });

        it('should allow reducers to be undone by clicking twice', function() {
            // Activate
            this.player1.clickCard(this.grove);
            // Deactivate
            this.player1.clickCard(this.grove);
            this.player1.clickCard('Bran Stark', 'hand');

            expect(this.player1Object.gold).toBe(1);
        });

        it('should allow reducers to be redone after being undone', function() {
            // Activate
            this.player1.clickCard(this.grove);
            // Deactivate
            this.player1.clickCard(this.grove);
            expect(this.grove.kneeled).toBe(false);
            // Reactivate
            this.player1.clickCard(this.grove);
            expect(this.grove.kneeled).toBe(true);
            this.player1.clickCard('Bran Stark', 'hand');

            expect(this.player1Object.gold).toBe(2);
        });

        it('should allow the same reducer to activate twice if stood through other means', function() {
            this.player1.clickCard(this.steward);

            this.player1.clickMenu('Power Behind the Throne', 'Discard a stand token');
            this.player1.clickCard(this.steward);

            expect(this.steward.kneeled).toBe(false);

            this.player1.clickCard(this.steward);

            this.player1.clickCard('Bran Stark', 'hand');

            expect(this.player1Object.gold).toBe(3);
        });
    });
});
