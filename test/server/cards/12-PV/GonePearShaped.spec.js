describe('Gone Pear Shaped', function () {
    describe("Gone Pear Shaped's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['gone-pear-shaped'],
                    archives: ['urchin', 'hunting-witch'],
                    inPlay: ['dew-faerie'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['krump', 'dust-pixie', 'shock-herder'],
                    archives: ['troll', 'ganger-chieftain']
                }
            });
        });

        it('should make each player discard their archives', function () {
            this.player1.play(this.gonePearShaped);
            expect(this.player1.archives.length).toBe(0);
            expect(this.player2.archives.length).toBe(0);
            expect(this.urchin.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prevent creatures from reaping for the remainder of the turn when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.gonePearShaped);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.clickPrompt('No');
            this.player2.reap(this.krump);
            this.player2.clickCard(this.shockHerder);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            this.player2.clickPrompt('Cancel');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.gonePearShaped.location).toBe('discard');
        });
    });
});
