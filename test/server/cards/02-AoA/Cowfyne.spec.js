describe('Cowfyne', function () {
    describe("Cowfyne's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cowfyne']
                },
                player2: {
                    inPlay: ['zorg', 'batdrone', 'dextre']
                }
            });
        });

        it('should deal 2 damage to neighbors of the creature being fought before fight', function () {
            this.player1.fightWith(this.cowfyne, this.batdrone);
            expect(this.zorg.tokens.damage).toBe(2);
            expect(this.batdrone.location).toBe('discard');
            expect(this.dextre.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
