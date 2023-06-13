describe('ForcedRetirement', function () {
    describe("ForcedRetirement's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['bubbles', 'forced-retirement'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should allow killing of friendly creture to gain one', function () {
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.forcedRetirement);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.flaxia);
            expect(this.player1.amber).toBe(2);

            expect(this.flaxia.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.krump.location).toBe('play area');

            this.player1.endTurn();
        });

        it('should allow killing of opponent creture to have opponent gain one', function () {
            expect(this.player2.amber).toBe(1);
            this.player1.play(this.forcedRetirement);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.gub);
            expect(this.player2.amber).toBe(2);

            expect(this.gub.location).toBe('discard');
            expect(this.flaxia.location).toBe('play area');
            expect(this.krump.location).toBe('play area');

            this.player1.endTurn();
        });
    });
});
