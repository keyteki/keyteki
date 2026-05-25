describe('Purifier of Souls', function () {
    describe("Purifier of Souls's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['sacro-fiend', 'purifier-of-souls']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('prevents Destroyed effects from triggering', function () {
            this.player1.fightWith(this.sacroFiend, this.troll);
            expect(this.sacroFiend.location).toBe('discard');
            // Sacro-Fiend's destroyed steal should NOT trigger
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
