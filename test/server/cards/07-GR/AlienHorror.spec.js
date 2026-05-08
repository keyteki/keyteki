describe('Alien Horror', function () {
    describe("Alien Horror's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['cpo-zytar', 'away-team', 'stealth-mode'],
                    inPlay: ['alien-horror'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 5,
                    inPlay: ['hunting-witch']
                }
            });
        });

        it('gives no extra power when not haunted', function () {
            expect(this.alienHorror.power).toBe(3);
        });

        it('gives extra power when not haunted', function () {
            this.player1.play(this.stealthMode);
            expect(this.alienHorror.power).toBe(10);
        });

        it('does no capture with no neighbors after a fight', function () {
            this.player1.fightWith(this.alienHorror, this.huntingWitch);
            expect(this.alienHorror.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
        });

        it('captures onto both neighbors after a fight', function () {
            this.player1.playCreature(this.cpoZytar, true);
            this.player1.playCreature(this.awayTeam);
            this.player1.fightWith(this.alienHorror, this.huntingWitch);
            expect(this.alienHorror.amber).toBe(0);
            expect(this.cpoZytar.amber).toBe(1);
            expect(this.awayTeam.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });
    });
});
