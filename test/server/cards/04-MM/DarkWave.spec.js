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
            expect(this.troll.damage).toBe(2);
            expect(this.ardentHero.damage).toBe(2);
            expect(this.shooler.damage).toBe(2);
            expect(this.bullWark.damage).toBe(0);
            expect(this.sacroBeast.damage).toBe(0);
        });
    });
});
