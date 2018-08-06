describe('Way of the Crab', function() {
    integration(function() {
        describe('Way of the Crab\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['kaiu-envoy'],
                        hand: ['way-of-the-crab']
                    },
                    player2: {
                        hand: ['political-rival', 'above-question']
                    }
                });
            });

            it('should force opponent to sacrifice a character', function() {
                this.player1.pass();
                this.politicalRival = this.player2.playCharacterFromHand('political-rival');
                this.player1.clickCard('way-of-the-crab');
                this.kaiuEnvoy = this.player1.clickCard('kaiu-envoy');
                expect(this.kaiuEnvoy.location).toBe('dynasty discard pile');
                expect(this.player1.fate).toBe(1);
                expect(this.player2).toHavePrompt('Way of the Crab');
                expect(this.player2).toBeAbleToSelect(this.politicalRival);
                this.player2.clickCard(this.politicalRival);
                expect(this.politicalRival.location).toBe('conflict discard pile');
            });

            it('should not be playable if the opponent has no characters', function() {
                this.player1.clickCard('way-of-the-crab');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should force opponent to sacrifice a character with Above Question', function() {
                this.player1.pass();
                this.politicalRival = this.player2.playCharacterFromHand('political-rival');
                this.player1.pass();
                this.player2.playAttachment('above-question', this.politicalRival);
                this.player1.clickCard('way-of-the-crab');
                this.kaiuEnvoy = this.player1.clickCard('kaiu-envoy');
                expect(this.kaiuEnvoy.location).toBe('dynasty discard pile');
                expect(this.player1.fate).toBe(1);
                expect(this.player2).toHavePrompt('Way of the Crab');
                expect(this.player2).toBeAbleToSelect(this.politicalRival);
                this.player2.clickCard(this.politicalRival);
                expect(this.politicalRival.location).toBe('conflict discard pile');
            });
        });
    });
});
