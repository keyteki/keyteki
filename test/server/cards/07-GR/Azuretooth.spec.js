describe('Azuretooth', function () {
    describe("Azuretooth's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['azuretooth', 'shrewd-investor']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub']
                }
            });
        });

        it('moves amber and gives control on reap', function () {
            this.shrewdInvestor.tokens.amber = 4;
            this.player1.reap(this.azuretooth);
            expect(this.player1).toBeAbleToSelect(this.azuretooth);
            expect(this.player1).toBeAbleToSelect(this.shrewdInvestor);
            this.player1.clickCard(this.shrewdInvestor);
            this.player1.clickPrompt('Left');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(1);
            expect(this.shrewdInvestor.amber).toBe(0);
            expect(this.player2.player.creaturesInPlay).toContain(this.shrewdInvestor);
        });

        it('moves amber and gives control on fight', function () {
            this.shrewdInvestor.tokens.amber = 4;
            this.player1.fightWith(this.azuretooth, this.gub);
            this.player1.clickCard(this.shrewdInvestor);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
            expect(this.shrewdInvestor.amber).toBe(0);
            expect(this.player2.player.creaturesInPlay).toContain(this.shrewdInvestor);
        });

        it('gives control without amber to move on reap', function () {
            this.player1.reap(this.azuretooth);
            this.player1.clickCard(this.shrewdInvestor);
            this.player1.clickPrompt('Left');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.shrewdInvestor.amber).toBe(0);
            expect(this.player2.player.creaturesInPlay).toContain(this.shrewdInvestor);
        });
    });
});
