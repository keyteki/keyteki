describe('Ensign Clark', function () {
    describe("Ensign Clark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['ensign-clark'],
                    inPlay: ['future-booster', 'cpo-zytar']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'gauntlet-of-command', 'quixxle-stone']
                }
            });
        });

        it('should destroy a friendly artifact when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.ensignClark);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2).not.toBeAbleToSelect(this.futureBooster);
            expect(this.player2).toBeAbleToSelect(this.gauntletOfCommand);
            expect(this.player2).toBeAbleToSelect(this.quixxleStone);
            expect(this.player2).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player2).not.toBeAbleToSelect(this.krump);
            this.player2.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('discard');
            expect(this.quixxleStone.location).toBe('play area');
            expect(this.ensignClark.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
