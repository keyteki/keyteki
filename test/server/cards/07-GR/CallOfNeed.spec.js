describe('Call of Need', function () {
    describe("Call of Need's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['call-of-need'],
                    discard: ['dominator-bauble', 'charette', 'sinder']
                }
            });
            this.player1.moveCard(this.dominatorBauble, 'deck');
            this.player1.moveCard(this.charette, 'deck');
        });

        it('searches for a card and discards it', function () {
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.callOfNeed);
            expect(this.player1).toBeAbleToSelect(this.dominatorBauble);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).not.toBeAbleToSelect(this.sinder);
            this.player1.clickCard(this.dominatorBauble);
            this.player1.clickPrompt('Done');
            expect(this.dominatorBauble.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
            expect(shuffled).toBe(this.player1.player);
        });
    });
});
