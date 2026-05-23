describe('Sacro-Fiend', function () {
    describe("Sacro-Fiend's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['sacro-fiend']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('steals 1A when destroyed', function () {
            this.player1.fightWith(this.sacroFiend, this.troll);
            expect(this.sacroFiend.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
