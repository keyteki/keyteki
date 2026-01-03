describe('Gysgt Margot', function () {
    describe("Gysgt Margot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['gysgt-margot', 'flaxia']
                },
                player2: {
                    inPlay: ['fandangle', 'lamindra']
                }
            });
        });

        it('should deal 2 damage and ward on reap', function () {
            this.player1.reap(this.gysgtMargot);
            expect(this.player1).toBeAbleToSelect(this.fandangle);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.gysgtMargot);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.fandangle);
            expect(this.fandangle.tokens.damage).toBe(2);
            expect(this.player1).not.toBeAbleToSelect(this.fandangle);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.gysgtMargot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.warded).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should deal 2 damage and ward on fight', function () {
            this.player1.fightWith(this.gysgtMargot, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.fandangle);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.gysgtMargot);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.fandangle);
            expect(this.fandangle.tokens.damage).toBe(2);
            expect(this.player1).not.toBeAbleToSelect(this.fandangle);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.gysgtMargot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.warded).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should still ward if no enemy creatures', function () {
            this.player2.moveCard(this.fandangle, 'discard');
            this.player2.moveCard(this.lamindra, 'discard');
            this.player1.reap(this.gysgtMargot);
            expect(this.player1).toBeAbleToSelect(this.gysgtMargot);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.warded).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
