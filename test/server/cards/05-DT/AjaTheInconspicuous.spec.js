describe('AjaTheInconspicuous', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'aja-the-inconspicuous', 'gub']
                },
                player2: {
                    hand: ['poke'],
                    amber: 2
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
        });

        describe('while Aja is not on a flank', function () {
            beforeEach(function () {
                this.player2.play(this.poke);
                this.player2.clickCard(this.ajaTheInconspicuous);
            });

            it('no damage dealt', function () {
                expect(this.ajaTheInconspicuous.tokens.damage).toBeUndefined();
            });
        });

        describe('while Aja is on a flank', function () {
            beforeEach(function () {
                this.player2.moveCard(this.badPenny, 'discard');
                this.player2.play(this.poke);
                this.player2.clickCard(this.ajaTheInconspicuous);
            });

            it('no damage dealt', function () {
                expect(this.ajaTheInconspicuous.tokens.damage).toBe(1);
            });
        });
    });
});
