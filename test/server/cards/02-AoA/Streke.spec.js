describe('Streke', function () {
    describe("Streke's hand size penalty when off-flank", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['streke', 'lamindra']
                },
                player2: {}
            });
        });

        it('does not reduce the opponent maximum hand size when Streke is on a flank', function () {
            expect(this.player2.player.maxHandSize).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Streke off-flank', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['lamindra', 'streke', 'troll']
                },
                player2: {}
            });
        });

        it('reduces the opponent maximum hand size by 1 when Streke is between two creatures', function () {
            expect(this.player2.player.maxHandSize).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
