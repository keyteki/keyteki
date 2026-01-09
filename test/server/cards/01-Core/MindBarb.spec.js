describe('Mind Barb', function () {
    describe("Mind Barb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['mind-barb']
                },
                player2: {
                    hand: ['lamindra', 'batdrone']
                }
            });
        });

        it('should discard a random card from opponent hand', function () {
            this.player1.play(this.mindBarb);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
