describe('Decree of Primus', function () {
    describe("Decree of Primus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['decree-of-primus'],
                    inPlay: ['charette', 'gub']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should move all amber from one creature to another', function () {
            this.charette.tokens.amber = 3;
            this.gub.tokens.amber = 1;
            this.player1.play(this.decreeOfPrimus);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.gub);
            expect(this.charette.tokens.amber).toBeUndefined();
            expect(this.gub.tokens.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work with creatures that have no amber', function () {
            this.charette.tokens.amber = 2;
            this.player1.play(this.decreeOfPrimus);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.gub);
            expect(this.charette.tokens.amber).toBeUndefined();
            expect(this.gub.tokens.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should work with enemy creatures', function () {
            this.charette.tokens.amber = 2;
            this.lamindra.tokens.amber = 1;
            this.player1.play(this.decreeOfPrimus);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.lamindra);
            expect(this.charette.tokens.amber).toBeUndefined();
            expect(this.lamindra.tokens.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
