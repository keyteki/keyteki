describe('Mechabuoy', function () {
    describe("Mechabuoy's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['mechabuoy']
                },
                player2: {
                    amber: 0,
                    hand: ['eyegor']
                }
            });
        });

        describe('player 1 has high tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.endTurn();
                expect(this.player1.amber).toBe(1);
            });

            it('player 2 should not gain 1A', function () {
                expect(this.player2.amber).toBe(0);
            });

            describe('and player 1 keeps high tide', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();
                });

                it('should gain 1A', function () {
                    expect(this.player1.amber).toBe(2);
                });
            });

            describe('and player 2 raises the tide', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.raiseTide();
                    this.player2.endTurn();
                });

                it('player 1 should not gain 1A', function () {
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(0);
                });

                describe('and player 2 gains 1A', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('logos');
                        this.player1.endTurn();
                    });

                    it('should not gain 1A', function () {
                        expect(this.player1.amber).toBe(1);
                        expect(this.player2.amber).toBe(1);
                    });
                });
            });
        });
    });
});
