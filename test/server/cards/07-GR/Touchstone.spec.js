describe('Snippy', function () {
    describe("Snippy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['a-strong-feeling'],
                    inPlay: ['touchstone', 'batdrone', 'shadys'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
            this.player1.moveCard(this.batdrone, 'deck');
            this.player1.moveCard(this.shadys, 'deck');
        });

        it('discards the top 2 cards of the deck when not haunted', function () {
            this.player1.reap(this.touchstone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.shadys.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(11);
            this.expectReadyToTakeAction(this.player1);
        });

        it('does nothing with no deck when not haunted', function () {
            this.player1.player.deck = [];
            this.player1.reap(this.touchstone);
            expect(this.player1.player.discard.length).toBe(9);
            this.expectReadyToTakeAction(this.player1);
        });

        it('draws 2 cards of the deck when haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.reap(this.touchstone);
            expect(this.batdrone.location).toBe('hand');
            expect(this.shadys.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
