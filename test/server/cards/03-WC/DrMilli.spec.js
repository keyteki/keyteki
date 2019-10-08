describe('Dr. Milli', function() {
    integration(function() {
        describe('Dr. Milli\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        hand: ['dr-milli', 'eyegor', 'doc-bookton', 'brain-eater', 'mother']
                    },
                    player2: {
                        inPlay: ['stealer-of-souls', 'overlord-greking', 'dust-imp', 'streke']
                    }
                });
            });

            it('should cause the player to archive 4 cards if the opponent has 4 creatures on the board, and dr milli is the only card in play', function() {
                this.player1.play(this.drMilli);
                expect(this.player1).toHavePrompt('Dr. Milli');
                expect(this.player1).toBeAbleToSelect(this.eyegor);
                expect(this.player1).toBeAbleToSelect(this.docBookton);
                expect(this.player1).toBeAbleToSelect(this.brainEater);
                this.player1.clickCard(this.eyegor);
                this.player1.clickCard(this.docBookton);
                this.player1.clickCard(this.brainEater);
                this.player1.clickCard(this.mother);
                this.player1.clickPrompt('Done');
                expect(this.eyegor.location).toBe('archives');
                expect(this.docBookton.location).toBe('archives');
                expect(this.brainEater.location).toBe('archives');
                expect(this.mother.location).toBe('archives');
            });
            it('should cause the player to archive 3 cards if the opponent has 4 creatures on the board, dr milli is the second card in play', function() {
                this.player1.play(this.mother);
                this.player1.play(this.drMilli);
                expect(this.player1).toHavePrompt('Dr. Milli');
                expect(this.player1).toBeAbleToSelect(this.eyegor);
                expect(this.player1).toBeAbleToSelect(this.docBookton);
                expect(this.player1).toBeAbleToSelect(this.brainEater);
                this.player1.clickCard(this.eyegor);
                this.player1.clickCard(this.docBookton);
                this.player1.clickCard(this.brainEater);
                this.player1.clickPrompt('Done');
                expect(this.eyegor.location).toBe('archives');
                expect(this.docBookton.location).toBe('archives');
                expect(this.brainEater.location).toBe('archives');
            });
        });
    });
});
