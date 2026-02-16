describe('PiSweven', function () {
    describe("PiSweven's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['pi-sweven']
                },
                player2: {
                    hand: ['eyegor']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.reap(this.piSweven);
            });

            it('draw 0', function () {
                expect(this.player1.player.hand.length).toBe(0);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.reap(this.piSweven);
            });

            it('draw 0', function () {
                expect(this.player1.player.hand.length).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.reap(this.piSweven);
            });

            it('draw 0', function () {
                expect(this.player1.player.hand.length).toBe(3);
            });
        });
    });
});
