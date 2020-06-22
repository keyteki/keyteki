describe('Shard of Greed', function () {
    describe("Shard of Greed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['masterplan', 'virtuous-works', 'protect-the-weak', 'snufflegator'],
                    inPlay: ['shard-of-greed', 'seeker-needle', 'shard-of-hope']
                },
                player2: {
                    hand: ['remote-access', 'shard-of-knowledge'],
                    inPlay: ['dextre']
                }
            });
        });

        it('should grant the player an amber for each friendly shard', function () {
            this.player1.clickCard(this.shardOfGreed);
            expect(this.player1).toHavePrompt('Shard of Greed');
            this.player1.clickPrompt("Use this card's action ability");
            expect(this.player1.amber).toBe(2);
        });

        it('should work properly when Remote Accessed and its the only shard', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfGreed);
            expect(this.player2.amber).toBe(2);
        });
        it('should work properly when Remote Accessed and theres another shard in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.shardOfKnowledge);
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfGreed);
            expect(this.player2.amber).toBe(3);
        });
    });
});
