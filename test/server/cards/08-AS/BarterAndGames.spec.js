describe('Barter and Games', function () {
    describe("Barter and Games's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['barter-and-games', 'dust-pixie'],
                    archives: ['shooler', 'charette'],
                    inPlay: ['ancient-bear', 'the-old-tinker']
                },
                player2: {
                    amber: 1,
                    hand: ['mark-of-dis', 'control-the-weak'],
                    inPlay: ['monsquito', 'hunting-witch']
                }
            });
        });

        it('should reveal a card from each hand', function () {
            this.player1.play(this.barterAndGames);
            this.player1.clickPrompt('My Hand');
            expect(this.player1).not.toHavePromptButton('My Hand');
            expect(this.player1).not.toHavePromptButton('My Archives');
            this.player1.clickPrompt("Opponent's Hand");
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.theOldTinker.location).toBe('play area');
            expect(this.monsquito.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1.discard.length).toBe(3);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.discard.length).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should reveal a card from each archive', function () {
            this.player1.play(this.barterAndGames);
            this.player1.clickPrompt('My Archives');
            this.player1.clickPrompt("Opponent's Archives");
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.ancientBear.location).toBe('play area');
            expect(this.theOldTinker.location).toBe('play area');
            expect(this.monsquito.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.player1.hand.length).toBe(1);
            expect(this.player1.archives.length).toBe(1);
            expect(this.player1.discard.length).toBe(2);
            expect(this.player2.hand.length).toBe(2);
            expect(this.player2.discard.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work with no cards in hand', function () {
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.play(this.barterAndGames);
            this.player1.clickPrompt('My Hand');
            this.player1.clickPrompt("Opponent's Hand");
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.ancientBear.location).toBe('play area');
            expect(this.theOldTinker.location).toBe('play area');
            expect(this.monsquito.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1.discard.length).toBe(2);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.discard.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work with no cards in hand going second', function () {
            this.player1.moveCard(this.dustPixie, 'discard');
            this.player1.play(this.barterAndGames);
            this.player1.clickPrompt("Opponent's Hand");
            this.player1.clickPrompt('My Hand');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.ancientBear.location).toBe('play area');
            expect(this.theOldTinker.location).toBe('play area');
            expect(this.monsquito.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1.discard.length).toBe(2);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.discard.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
