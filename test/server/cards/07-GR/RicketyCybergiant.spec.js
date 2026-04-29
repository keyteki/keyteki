describe('Rickety Cybergiant', function () {
    describe("Rickety Cybergiant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['groke', 'rickety-cybergiant']
                },
                player2: {
                    inPlay: ['cpo-zytar', 'flaxia']
                }
            });
        });

        it('deals 1 damage to itself after a fight', function () {
            this.player1.fightWith(this.ricketyCybergiant, this.cpoZytar);
            expect(this.ricketyCybergiant.damage).toBe(5);
            expect(this.groke.damage).toBe(0);
            expect(this.flaxia.damage).toBe(0);
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
