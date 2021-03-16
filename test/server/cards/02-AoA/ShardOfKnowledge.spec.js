describe('Shard of Strength', function () {
    describe("Shard of Strength's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre', 'urchin'],
                    inPlay: [
                        'shard-of-knowledge',
                        'shard-of-greed',
                        'seeker-needle',
                        'shard-of-hope'
                    ]
                },
                player2: {
                    hand: ['remote-access', 'borrow', 'lamindra'],
                    inPlay: ['mother', 'archimedes', 'shard-of-greed']
                }
            });
        });

        it('should draw a card for each friendly shard', function () {
            expect(this.player1.player.hand.length).toBe(2);
            this.player1.useAction(this.shardOfKnowledge);
            expect(this.player1.player.hand.length).toBe(5);
        });

        it('should work properly when Remote Accessed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.player2.player.hand.length).toBe(3);
            this.player2.play(this.remoteAccess);
            expect(this.player2).toHavePrompt('Remote Access');
            this.player2.clickCard(this.shardOfKnowledge);
            expect(this.player2.player.hand.length).toBe(4);
        });

        it('should work properly when Borrowed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.player2.player.hand.length).toBe(3);
            this.player2.play(this.borrow);
            this.player2.clickCard(this.shardOfKnowledge);
            this.player2.useAction(this.shardOfKnowledge);
            expect(this.player2.player.hand.length).toBe(4);
        });
    });
});
