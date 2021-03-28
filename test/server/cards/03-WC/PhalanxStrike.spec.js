describe('Phalanx Strike', function () {
    describe("Phalanx Strike's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['batdrone', 'doc-bookton', 'phalanx-strike', 'twin-bolt-emission'],
                    inPlay: ['mother', 'brain-eater']
                },
                player2: {
                    inPlay: ['macis-asp', 'silvertooth', 'urchin']
                }
            });
        });

        it('should prompt the player to select a target', function () {
            this.player1.play(this.phalanxStrike);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
        });

        it('should deal one damage for each friendly creature to the selected target', function () {
            this.player1.play(this.phalanxStrike);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.mother);
            expect(this.mother.tokens.damage).toBe(2);
        });

        it('should prompt the player to repeat the ability if they exalt a friendly creature - and accept', function () {
            this.player1.play(this.phalanxStrike);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.mother);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.mother);
            expect(this.mother.tokens.amber).toBe(1);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt the player to repeat the ability if they exalt a friendly creature - but refuse', function () {
            this.player1.play(this.phalanxStrike);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.macisAsp);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.mother);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt the player to repeat the ability if they exalt a friendly creature, even if first target was warded', function () {
            this.mother.ward();
            this.player1.play(this.phalanxStrike);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            this.player1.clickCard(this.mother);
            expect(this.player1).toHavePrompt('Phalanx Strike');
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.brainEater);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
