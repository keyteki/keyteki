describe("Trenk's Creed", function () {
    describe("Trenk's Creed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['trenk-s-creed'],
                    inPlay: ['ember-imp', 'brutodon-auxiliary']
                },
                player2: {
                    amber: 3,
                    inPlay: ['krump', 'ancient-bear']
                }
            });
        });

        it("should allow capturing opponent's amber with most powerful creature", function () {
            this.player1.play(this.trenkSCreed);
            this.player1.clickPrompt("Capture opponent's amber");
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);

            expect(this.krump.tokens.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow moving amber from most powerful creature to common supply', function () {
            this.krump.tokens.amber = 2;
            this.player1.play(this.trenkSCreed);
            this.player1.clickPrompt('Move amber to common supply');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.brutodonAuxiliary);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.krump);

            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
