describe('Curse Of Forgetfulness', function () {
    describe("Curse Of Forgetfulness's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['curse-of-forgetfulness'],
                    discard: ['brammo']
                },
                player2: {
                    discard: ['john-smyth', 'faust-the-great']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.curseOfForgetfulness);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('should enter play under opponents control', function () {
                expect(this.curseOfForgetfulness.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfForgetfulness);
                expect(this.player2.player.cardsInPlay).toContain(this.curseOfForgetfulness);
            });

            describe("at the end of owner's turn", function () {
                beforeEach(function () {
                    expect(this.johnSmyth.location).toBe('discard');
                    this.player2.endTurn();
                });

                it('should purge the top card of discard', function () {
                    expect(this.johnSmyth.location).toBe('purged');
                });

                describe("at the end of opponent's turn", function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('brobnar');
                        this.player1.endTurn();
                    });

                    it('should not purge the top card of discard', function () {
                        expect(this.brammo.location).toBe('discard');
                    });
                });
            });
        });
    });
});
