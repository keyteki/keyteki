describe('Yxl the Iron Captain', function () {
    describe("Yxl the Iron Captain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'mars',
                    inPlay: ['ironyx-rebel', 'borka-rikk', 'pelf', 'blypyp'],
                    hand: ['yxl-the-iron-captain']
                },
                player2: {
                    amber: 10,
                    inPlay: ['ironyx-rebel']
                }
            });
        });

        it('should capture 2 on each friendly Ironyx creature', function () {
            this.ironyxRebel2 = this.player2.player.creaturesInPlay[0];
            this.player1.play(this.yxlTheIronCaptain);
            expect(this.player2.amber).toBe(4);
            expect(this.ironyxRebel.amber).toBe(2);
            expect(this.borkaRikk.amber).toBe(2);
            expect(this.yxlTheIronCaptain.amber).toBe(2);
            expect(this.pelf.amber).toBe(0);
            expect(this.blypyp.amber).toBe(0);
            expect(this.ironyxRebel2.amber).toBe(0);
        });

        it('should prompt if not enough to capture', function () {
            this.ironyxRebel2 = this.player2.player.creaturesInPlay[0];
            this.player2.amber = 3;
            this.player1.play(this.yxlTheIronCaptain);
            expect(this.player1).toBeAbleToSelect(this.ironyxRebel);
            expect(this.player1).toBeAbleToSelect(this.borkaRikk);
            expect(this.player1).toBeAbleToSelect(this.yxlTheIronCaptain);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxRebel2);
            this.player1.clickCard(this.borkaRikk);
            this.player1.clickCard(this.yxlTheIronCaptain);
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(0);
            expect(this.ironyxRebel.amber).toBe(0);
            expect(this.borkaRikk.amber).toBe(2);
            expect(this.yxlTheIronCaptain.amber).toBe(1);
            expect(this.pelf.amber).toBe(0);
            expect(this.blypyp.amber).toBe(0);
        });

        it('should give leftover amber to last-clicked creature', function () {
            this.ironyxRebel2 = this.player2.player.creaturesInPlay[0];
            this.player2.amber = 3;
            this.player1.play(this.yxlTheIronCaptain);
            expect(this.player1).toBeAbleToSelect(this.ironyxRebel);
            expect(this.player1).toBeAbleToSelect(this.borkaRikk);
            expect(this.player1).toBeAbleToSelect(this.yxlTheIronCaptain);
            expect(this.player1).not.toBeAbleToSelect(this.pelf);
            expect(this.player1).not.toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.ironyxRebel2);
            this.player1.clickCard(this.yxlTheIronCaptain);
            this.player1.clickCard(this.borkaRikk);
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(0);
            expect(this.ironyxRebel.amber).toBe(0);
            expect(this.borkaRikk.amber).toBe(1);
            expect(this.yxlTheIronCaptain.amber).toBe(2);
            expect(this.pelf.amber).toBe(0);
            expect(this.blypyp.amber).toBe(0);
        });
    });
});
