describe('Token of Appreciation', function () {
    describe("Token of Appreciation's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'ekwidon',
                    token: 'strange-shell',
                    inPlay: ['strange-shell:antiquities-dealer', 'strange-shell:shrewd-investor'],
                    hand: ['token-of-appreciation']
                }
            });
        });

        it('should make a token and forge a key if you have enough amber', function () {
            this.player1.play(this.tokenOfAppreciation);
            this.player1.clickPrompt('Right');
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make a token and fail to forge a key if you do not have enough amber', function () {
            this.player1.amber = 7;
            this.player1.play(this.tokenOfAppreciation);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.keys.red).toBe(false);
            expect(this.player1.player.keys.blue).toBe(false);
            expect(this.player1.player.keys.yellow).toBe(false);
            expect(this.player1.amber).toBe(7);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
