describe('Art Project', function () {
    describe("Art Project's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['art-project']
                },
                player2: {
                    amber: 6,
                    deck: new Array(36).fill('poke')
                }
            });
        });

        it('does nothing if no keys are unforged', function () {
            let p2hand = this.player2.player.hand.length;
            this.player1.play(this.artProject);
            expect(this.artProject.location).toBe('discard');
            expect(this.player2.player.hand.length).toBe(p2hand);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('unforges a key, purges self, draws opponent ten cards', function () {
            this.player1.endTurn();
            this.player2.forgeKey('Red');
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            let p2hand = this.player2.player.hand.length;
            this.player1.play(this.artProject);
            expect(this.artProject.location).toBe('purged');
            expect(this.player2.player.hand.length).toBe(p2hand + 10);
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
