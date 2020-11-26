describe('ProfressorTerato', function () {
    describe("ProfressorTerato's gain ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'professor-terato']
                },
                player2: {
                    inPlay: ['lamindra', 'research-smoko'],
                    hand: []
                }
            });
        });

        it('should give reap affects to all mutant creatures', function () {
            this.player1.reap(this.dextre);
            expect(this.player1.hand.length).toBe(0);

            this.player1.reap(this.professorTerato);
            expect(this.player1.hand.length).toBe(1);
        });

        it('should give reap affects to enemy mutant creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');

            this.player2.reap(this.researchSmoko);
            expect(this.player2.hand.length).toBe(1);
        });
    });
});
