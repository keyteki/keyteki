describe('Borrow', function () {
    describe("Borrow's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    hand: ['borrow', 'troll', 'dominator-bauble'],
                    inPlay: ['the-sting']
                },
                player2: {
                    amber: 2,
                    inPlay: ['city-gates', 'customs-office']
                }
            });
        });

        it('should take control of an artifact', function () {
            this.player1.play(this.borrow);
            expect(this.player1).toBeAbleToSelect(this.cityGates);
            expect(this.player1).toBeAbleToSelect(this.customsOffice);
            expect(this.player1).not.toBeAbleToSelect(this.theSting);
            this.player1.clickCard(this.cityGates);
            expect(this.player1.player.cardsInPlay).toContain(this.cityGates);
            expect(this.cityGates.controller).toBe(this.player1.player);
            expect(this.cityGates.hasHouse('shadows')).toBe(true);
            expect(this.cityGates.hasHouse('saurian')).toBe(false);
        });

        it('should not change the house of a shadows artifact', function () {
            this.player1.play(this.borrow);
            this.player1.clickCard(this.customsOffice);
            expect(this.player1.player.cardsInPlay).toContain(this.customsOffice);
            expect(this.customsOffice.controller).toBe(this.player1.player);
            expect(this.customsOffice.hasHouse('shadows')).toBe(true);
        });
    });
});
