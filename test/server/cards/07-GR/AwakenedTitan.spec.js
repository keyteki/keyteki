describe('Awakened Titan', function () {
    describe("Awakened Titan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['burn-the-stockpile', 'ganger-chieftain'],
                    inPlay: ['awakened-titan'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('does not ready at end of turn if not haunted', function () {
            this.player1.reap(this.awakenedTitan);
            this.player1.endTurn();
            expect(this.awakenedTitan.exhausted).toBe(true);
        });

        it('does not ready by card effects if not haunted', function () {
            this.player1.reap(this.awakenedTitan);
            this.player1.playCreature(this.gangerChieftain);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.awakenedTitan);
            expect(this.awakenedTitan.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does ready if haunted', function () {
            this.player1.play(this.burnTheStockpile);
            this.player1.reap(this.awakenedTitan);
            this.player1.endTurn();
            expect(this.awakenedTitan.exhausted).toBe(false);
        });
    });
});
