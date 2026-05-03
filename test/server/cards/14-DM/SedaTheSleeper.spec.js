describe('Seda the Sleeper', function () {
    describe("Seda the Sleeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['seda-the-sleeper', 'caspart']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('is invulnerable while exhausted on flank', function () {
            this.player1.fightWith(this.sedaTheSleeper, this.bumpsy);
            expect(this.sedaTheSleeper.exhausted).toBe(true);
            expect(this.sedaTheSleeper.isOnFlank()).toBe(true);
            expect(this.sedaTheSleeper.getKeywordValue('invulnerable')).toBe(1);
        });

        it('is not invulnerable when ready', function () {
            expect(this.sedaTheSleeper.exhausted).toBe(false);
            expect(this.sedaTheSleeper.getKeywordValue('invulnerable')).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Seda the Sleeper's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['seda-the-sleeper']
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('captures 6 on play', function () {
            this.player1.play(this.sedaTheSleeper);
            expect(this.sedaTheSleeper.amber).toBe(6);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
