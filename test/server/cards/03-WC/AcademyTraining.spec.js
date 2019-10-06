describe('Academy Training', function() {
    integration(function() {
        describe('Academy Training\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'logos',
                        inPlay: ['eyegor', 'rustgnawer'],
                        hand: ['academy-training']
                    },
                    player2: {
                        amber: 4,
                        hand: ['urchin', 'dextre']
                    }
                });
            });

            it('should treat the upgraded creature as Logos, but not its original house', function() {
                this.player1.playUpgrade(this.academyTraining, this.rustgnawer);
                this.player1.reap(this.rustgnawer);
                expect(this.player1.amber).toBe(1);
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.clickCard(this.rustgnawer);
                expect(this.player1).not.toHavePromptButton('Reap with this creature');
                expect(this.player1.amber).toBe(1);
            });

            it('should add the \'draw a card\' effect to reaping', function() {
                this.player1.playUpgrade(this.academyTraining, this.rustgnawer);
                expect(this.player1.hand.length).toBe(0);
                this.player1.reap(this.rustgnawer);
                expect(this.player1.amber).toBe(1);
                expect(this.player1.hand.length).toBe(1);
            });
        });
    });
});
