describe('Numquid the Fair', function () {
    describe("Numquid the Fair's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['numquid-the-fair']
                },
                player2: {
                    inPlay: ['urchin', 'silvertooth', 'umbra']
                }
            });
        });

        it('should destroy enemy creatures until both players have the same number of creatures', function () {
            this.player1.play(this.numquidTheFair);
            expect(this.player1).toHavePrompt('Numquid the Fair');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.urchin);
            expect(this.player1).toHavePrompt('Numquid the Fair');
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            this.player1.clickCard(this.umbra);
            expect(this.urchin.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('continue to destroy through warded creatures', function () {
            this.urchin.ward();
            this.player1.play(this.numquidTheFair);
            this.player1.clickCard(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.umbra);
            expect(this.urchin.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
