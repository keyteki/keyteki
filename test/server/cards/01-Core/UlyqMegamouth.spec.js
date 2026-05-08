describe('Ulyq Megamouth', function () {
    describe("Ulyq Megamouth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['ulyq-megamouth', 'dextre', 'zorg']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should allow using a friendly non-Mars creature on reap', function () {
            this.player1.reap(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow using a friendly non-Mars creature on fight', function () {
            this.player1.fightWith(this.ulyqMegamouth, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not target Mars creatures', function () {
            this.player1.moveCard(this.dextre, 'hand');
            this.player1.reap(this.ulyqMegamouth);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
