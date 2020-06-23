describe('gizelharts-wrath', function () {
    describe("Gizelharts Wrath's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['gizelhart-s-wrath'],
                    inPlay: ['dust-imp', 'munchling']
                },
                player2: {
                    inPlay: ['batdrone', 'bot-bookton']
                }
            });
        });

        it('should destroy all mutants', function () {
            this.player1.play(this.gizelhartSWrath);
            expect(this.munchling.location).toBe('discard');
            expect(this.botBookton.location).toBe('discard');
        });

        it('should not destroy non-mutant creatures', function () {
            this.player1.play(this.gizelhartSWrath);
            expect(this.batdrone.location).toBe('play area');
            expect(this.dustImp.location).toBe('play area');
        });
    });
});
