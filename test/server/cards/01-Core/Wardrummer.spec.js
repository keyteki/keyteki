describe('Wardrummer', function () {
    describe("Wardrummer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['wardrummer'],
                    inPlay: ['troll', 'krump', 'dextre']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should return all other friendly Brobnar creatures to hand on play', function () {
            this.player1.playCreature(this.wardrummer);
            expect(this.troll.location).toBe('hand');
            expect(this.krump.location).toBe('hand');
            expect(this.dextre.location).toBe('play area');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.wardrummer.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
