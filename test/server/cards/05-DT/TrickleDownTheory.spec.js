describe('Trickle-Down Theory', function () {
    describe("Trickle-Down Theory's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra'],
                    hand: ['trickle-down-theory']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.trickleDownTheory);
            });

            it('should raise the tide', function () {
                expect(this.player1.isTideHigh()).toBe(true);
                expect(this.player1.chains).toBe(0);
            });

            describe('while opponent has less then 6A', function () {
                beforeEach(function () {
                    this.trickleDownTheory.ready();
                    this.player1.useOmni(this.trickleDownTheory);
                });

                it('should not gain 1A', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(5);
                });
            });

            describe('while opponent has 6A', function () {
                beforeEach(function () {
                    this.player2.player.amber = 6;
                    this.trickleDownTheory.ready();
                    this.player1.useOmni(this.trickleDownTheory);
                });

                it('should gain 1A', function () {
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(6);
                });
            });

            describe('while opponent more than 6A', function () {
                beforeEach(function () {
                    this.player2.player.amber = 7;
                    this.trickleDownTheory.ready();
                    this.player1.useOmni(this.trickleDownTheory);
                });

                it('should gain 1A', function () {
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(7);
                });
            });
        });
    });
});
