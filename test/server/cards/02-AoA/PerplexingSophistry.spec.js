describe('Perplexing Sophistry', function () {
    describe("Perplexing Sophistry's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['perplexing-sophistry'],
                    deck: ['troll', 'krump'],
                    amber: 3
                },
                player2: {
                    hand: ['lamindra'],
                    amber: 1
                }
            });
        });

        it('makes the opponent discard a random card and the player draws a card', function () {
            this.player1.play(this.perplexingSophistry);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Perplexing Sophistry when amber is equal or less than the opponent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['perplexing-sophistry'],
                    deck: ['troll'],
                    amber: 4
                },
                player2: {
                    hand: ['lamindra'],
                    amber: 5
                }
            });
        });

        it('does nothing', function () {
            this.player1.play(this.perplexingSophistry);
            expect(this.lamindra.location).toBe('hand');
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
