describe('Burning Glare', function () {
    describe("Burning Glare's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['burning-glare'],
                    inPlay: ['pismire']
                },
                player2: {
                    amber: 2,
                    hand: ['troll'],
                    inPlay: ['keyfrog', 'dextre', 'techno-beast', 'professor-terato']
                }
            });
        });

        it('should allow stunning any enemy creature', function () {
            this.player1.play(this.burningGlare);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Stun an enemy creature');
            expect(this.player1).toHavePromptButton('Stun all enemy mutants');
            this.player1.clickPrompt('Stun an enemy creature');
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).toBeAbleToSelect(this.technoBeast);
            expect(this.player1).not.toBeAbleToSelect(this.pismire);
            this.player1.clickCard(this.keyfrog);
            expect(this.keyfrog.stunned).toBe(true);
            expect(this.dextre.stunned).toBe(false);
            expect(this.professorTerato.stunned).toBe(false);
            expect(this.technoBeast.stunned).toBe(false);
            expect(this.pismire.stunned).toBe(false);
        });

        it('should allow stunning all enemy mutant creatures', function () {
            this.player1.play(this.burningGlare);
            this.player1.clickPrompt('Stun all enemy mutants');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.keyfrog.stunned).toBe(false);
            expect(this.dextre.stunned).toBe(false);
            expect(this.professorTerato.stunned).toBe(true);
            expect(this.technoBeast.stunned).toBe(true);
            expect(this.pismire.stunned).toBe(false);
        });
    });
});
