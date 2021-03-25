describe('Frigorific Rod', function () {
    describe("Frigorific Rod's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['frigorific-rod', 'dextre']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'seeker-needle']
                }
            });
        });

        it('should exhaust a targeted enemy creature when used', function () {
            this.player1.useAction(this.frigorificRod);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
            this.player1.clickCard(this.mightyTiger);
            expect(this.mightyTiger.exhausted).toBe(true);
        });

        it('should exhaust a targeted friendly creature when used', function () {
            this.player1.useAction(this.frigorificRod);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.dextre);
            expect(this.dextre.exhausted).toBe(true);
        });

        it('should exhaust an artifact friendly creature when used', function () {
            this.player1.useAction(this.frigorificRod);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            this.player1.clickCard(this.seekerNeedle);
            expect(this.seekerNeedle.exhausted).toBe(true);
        });
    });
});
