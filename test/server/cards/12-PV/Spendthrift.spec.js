describe('Spendthrift', function () {
    describe("Spendthrift's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['urchin', 'hunting-witch'],
                    hand: ['spendthrift'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie']
                }
            });
        });

        it('should move amber to common supply and exalt the creature', function () {
            this.urchin.tokens.amber = 2;
            this.krump.tokens.amber = 1;
            this.player1.play(this.spendthrift);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move amber from enemy creatures to their pool when fate is triggered', function () {
            this.krump.tokens.amber = 2;
            this.urchin.tokens.amber = 1;
            this.huntingWitch.tokens.amber = 2;
            this.player1.activateProphecy(this.overreach, this.spendthrift);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.tokens.amber).toBe(2);
            expect(this.huntingWitch.tokens.amber).toBeUndefined();
            expect(this.urchin.tokens.amber).toBeUndefined();
            expect(this.player1.amber).toBe(7);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
