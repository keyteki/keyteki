describe('Hidden Stash', function () {
    describe("Hidden Stash's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['hidden-stash', 'silvertooth']
                },
                player2: {}
            });
        });

        it('should archive a card from hand', function () {
            this.player1.play(this.hiddenStash);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Hidden Stash's ability with no other cards in hand", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['hidden-stash']
                },
                player2: {}
            });
        });

        it('should not prompt when there are no other cards in hand', function () {
            this.player1.play(this.hiddenStash);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
