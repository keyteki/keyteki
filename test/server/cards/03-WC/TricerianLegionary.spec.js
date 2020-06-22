describe('Tricerian Legionary', function () {
    describe("Tricerian Legionary's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['troll'],
                    hand: ['tricerian-legionary']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
            expect(this.troll.warded).toBe(false);
            expect(this.tricerianLegionary.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });

        it('Play can only ward friendly creatures', function () {
            this.player1.play(this.tricerianLegionary);

            expect(this.player1).toHavePrompt('Tricerian Legionary');

            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.tricerianLegionary);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.troll);

            expect(this.troll.warded).toBe(true);
            expect(this.tricerianLegionary.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });
    });
});
