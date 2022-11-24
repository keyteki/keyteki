describe('Airlock', function () {
    describe("Airlock's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 1,
                    hand: ['lamindra', 'keyfrog', 'key-abduction', 'mars-first'],
                    archives: ['witch-of-the-eye'],
                    inPlay: ['airlock', 'flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should allow selecting only non-mars cards from hand', function () {
            this.player1.useAction(this.airlock);
            expect(this.player1).not.toBeAbleToSelect(this.airlock);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).not.toBeAbleToSelect(this.keyAbduction);
            expect(this.player1).not.toBeAbleToSelect(this.marsFirst);
            expect(this.player1).not.toBeAbleToSelect(this.witchOfTheEye);
        });

        it('if a non-mars card is discarded, should draw a card', function () {
            expect(this.player1.hand.length).toBe(4);
            this.player1.useAction(this.airlock);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.hand.length).toBe(4);
            this.player1.endTurn();
        });

        it('if a non-mars card is not discarded, should not draw a card', function () {
            this.player1.moveCard(this.lamindra, 'archives');
            this.player1.moveCard(this.keyfrog, 'archives');
            expect(this.player1.hand.length).toBe(2);
            this.player1.useAction(this.airlock);
            this.player1.moveCard(this.lamindra, 'archives');
            this.player1.moveCard(this.keyfrog, 'archives');
            expect(this.player1.hand.length).toBe(2);
            this.player1.endTurn();
        });
    });
});
