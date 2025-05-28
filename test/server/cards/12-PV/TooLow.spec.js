describe('Too Low', function () {
    describe("Too Low's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['urchin', 'hunting-witch', 'tantadlin'],
                    hand: ['too-low'],
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

        it('should destroy creatures with power less than the chosen creature', function () {
            this.player1.play(this.tooLow);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
            this.player1.clickCard(this.krump);
            expect(this.urchin.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.krump.location).toBe('play area');
            expect(this.tantadlin.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy friendly creatures with the lowest power when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.tooLow);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.urchin.location).toBe('play area');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.tantadlin.location).toBe('play area');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
