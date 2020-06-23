describe('Imperium', function () {
    describe("Imperium's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll', 'flaxia'],
                    hand: ['imperium']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
            expect(this.troll.warded).toBe(false);
            expect(this.flaxia.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });

        it('should ward 2 friendly creatures', function () {
            this.player1.play(this.imperium);

            expect(this.player1).toHavePrompt('Imperium');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.flaxia);

            this.player1.clickPrompt('Done');

            expect(this.troll.warded).toBe(true);
            expect(this.flaxia.warded).toBe(true);
            expect(this.lamindra.warded).toBe(false);
        });
    });
});
