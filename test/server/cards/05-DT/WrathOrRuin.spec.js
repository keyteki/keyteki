describe('Wrath or Ruin', function () {
    describe("Wrath or Ruin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['wrath-or-ruin'],
                    inPlay: ['pismire']
                },
                player2: {
                    inPlay: ['keyfrog', 'dextre', 'techno-beast', 'professor-terato']
                }
            });
        });

        it('should allow destroying any flank creature', function () {
            this.player1.play(this.wrathOrRuin);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Destroy a flank creature');
            expect(this.player1).toHavePromptButton('Return 2 enemy creatures to hand');
            this.player1.clickPrompt('Destroy a flank creature');

            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.technoBeast);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).toBeAbleToSelect(this.pismire);

            this.player1.clickCard(this.professorTerato);

            expect(this.professorTerato.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should allow stunning all enemy mutant creatures', function () {
            this.player1.play(this.wrathOrRuin);
            this.player1.clickPrompt('Return 2 enemy creatures to hand');

            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.technoBeast);
            expect(this.player1).toBeAbleToSelect(this.professorTerato);
            expect(this.player1).not.toBeAbleToSelect(this.pismire);

            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.keyfrog);
            this.player1.clickPrompt('Done');

            expect(this.keyfrog.location).toBe('hand');
            expect(this.dextre.location).toBe('hand');
        });

        it('should allow choosing to return enemy creatures, even though no enemy creatures are in play', function () {
            this.player1.moveCard(this.professorTerato, 'discard');
            this.player1.moveCard(this.technoBeast, 'discard');
            this.player1.moveCard(this.dextre, 'discard');
            this.player1.moveCard(this.keyfrog, 'discard');
            this.player1.play(this.wrathOrRuin);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Destroy a flank creature');
            expect(this.player1).toHavePromptButton('Return 2 enemy creatures to hand');
            this.player1.clickPrompt('Return 2 enemy creatures to hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
