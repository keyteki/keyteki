describe('Nepeta Gigantica', function () {
    describe("Nepeta Gigantica's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['nepeta-gigantica', 'tantadlin', 'dextre', 'moor-wolf', 'brammo']
                },
                player2: {
                    inPlay: ['drummernaut']
                }
            });
        });

        it('should give the option to choose between stunning P>5 or Giant', function () {
            this.player1.useAction(this.nepetaGigantica);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.drummernaut);
            expect(this.player1).toBeAbleToSelect(this.brammo);
            expect(this.player1).not.toBeAbleToSelect(this.moorWolf);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.stunned).toBe(true);
        });
    });
});
