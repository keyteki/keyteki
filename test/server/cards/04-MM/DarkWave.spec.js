describe('Dark Wave', function () {
    describe("Dark Wave's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['dark-wave'],
                    inPlay: ['troll', 'ardent-hero', 'bull-wark']
                },
                player2: {
                    inPlay: ['shooler', 'sacro-beast']
                }
            });
        });

        it('should deal 2D to each non-mutant', function () {
            this.player1.play(this.darkWave);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.ardentHero.tokens.damage).toBe(2);
            expect(this.shooler.tokens.damage).toBe(2);
            expect(this.bullWark.tokens.damage).toBeUndefined();
            expect(this.sacroBeast.tokens.damage).toBeUndefined();
        });
    });
});
