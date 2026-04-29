describe('Freebooter Faye', function () {
    describe("Freebooter Faye's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra'],
                    hand: ['freebooter-faye']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.freebooterFaye);
            });

            it('should raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
                expect(this.player1.chains).toBe(0);
            });

            describe('while the tide is high and reap', function () {
                beforeEach(function () {
                    this.freebooterFaye.ready();
                    this.player1.reap(this.freebooterFaye);
                });

                it('should steal 1A', function () {
                    expect(this.player1.amber).toBe(4);
                    expect(this.player2.amber).toBe(1);
                });
            });

            describe('while the tide is not high and reap', function () {
                beforeEach(function () {
                    this.player1.lowerTide();
                    this.freebooterFaye.ready();
                    this.player1.reap(this.freebooterFaye);
                });

                it('should not steal 1A', function () {
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(2);
                });
            });
        });
    });
});
