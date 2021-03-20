describe('ShiftingBattlefield', function () {
    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'foozle', 'gatekeeper', 'francus'],
                    hand: ['shifting-battlefield']
                },
                player2: {
                    amber: 2,
                    inPlay: ['narp']
                }
            });
        });

        describe('selects creature to move', function () {
            beforeEach(function () {
                this.player1.play(this.shiftingBattlefield);
            });

            it('should prompt to move an enemy creature', function () {
                expect(this.player1).not.toBeAbleToSelect(this.narp);
                expect(this.player1).toBeAbleToSelect(this.foozle);
            });

            describe('selects creature to move', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.foozle);
                    this.player1.clickCard(this.francus);
                    this.player1.clickPrompt('Right');
                });

                it('moves creature and captures 1', function () {
                    expect(this.player1.player.cardsInPlay[0]).toBe(this.badPenny);
                    expect(this.player1.player.cardsInPlay[1]).toBe(this.gatekeeper);
                    expect(this.player1.player.cardsInPlay[2]).toBe(this.francus);
                    expect(this.player1.player.cardsInPlay[3]).toBe(this.foozle);
                    expect(this.foozle.amber).toBe(1);
                });
            });
        });
    });
});
