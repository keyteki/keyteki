describe('Harvest Skimmer', function () {
    describe("Harvest Skimmer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['harvest-skimmer'],
                    discard: ['shadys', 'full-moon']
                }
            });
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.shadys, 'deck');
        });

        it('discards top card of the deck', function () {
            let p1deck = this.player1.player.deck.length;
            this.player1.reap(this.harvestSkimmer);
            expect(this.player1.player.deck.length).toBe(p1deck - 1);
        });

        it('gains 1 for discarding a creature', function () {
            this.player1.reap(this.harvestSkimmer);
            expect(this.shadys.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('gains nothing for discarding a non-creature', function () {
            this.player1.moveCard(this.shadys, 'discard');
            this.player1.reap(this.harvestSkimmer);
            expect(this.fullMoon.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does nothing with no deck', function () {
            this.player1.player.deck = [];
            this.player1.reap(this.harvestSkimmer);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
