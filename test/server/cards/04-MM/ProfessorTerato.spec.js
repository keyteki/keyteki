describe('ProfressorTerato', function () {
    integration(function () {
        describe("ProfressorTerato's gain ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['dextre', 'professor-terato']
                    },
                    player2: {
                        inPlay: ['lamindra'],
                        hand: ['relentless-whispers']
                    }
                });
            });

            it('should give reap affects to all mutant creatures', function () {
                this.player1.reap(this.dextre);
                expect(this.player1.hand.length).toBe(0);

                this.player1.reap(this.professorTerato);
                expect(this.player1.hand.length).toBe(1);
            });
        });
    });
});
