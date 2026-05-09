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
            this.charette.amber = 3;
            this.gub.amber = 1;
            this.player1.play(this.decreeOfPrimus);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.charette);
            this.player1.clickCard(this.gub);
            expect(this.charette.amber).toBe(0);
            expect(this.gub.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work with creatures that have no amber', function () {
            this.charette.amber = 2;
            this.player1.play(this.decreeOfPrimus);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.gub);
            expect(this.charette.amber).toBe(0);
            expect(this.gub.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work with enemy creatures', function () {
            this.charette.amber = 2;
            this.lamindra.amber = 1;
            this.player1.play(this.decreeOfPrimus);
            this.player1.clickCard(this.charette);
            this.player1.clickCard(this.lamindra);
            expect(this.charette.amber).toBe(0);
            expect(this.lamindra.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
