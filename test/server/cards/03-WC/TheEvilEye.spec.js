describe('The Evil Eye', function () {
    describe("The Evil Eye's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'dis',
                    hand: ['the-evil-eye']
                },
                player2: {
                    amber: 6
                }
            });
        });
        it('should stop a key being forged', function () {
            this.player1.play(this.theEvilEye);
            this.player1.endTurn();
            expect(this.player2.player.keys.red).toBe(false);
            expect(this.player2.player.keys.blue).toBe(false);
            expect(this.player2.player.keys.yellow).toBe(false);
            expect(this.player2.player.amber).toBe(6);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'dis',
                    hand: ['the-evil-eye'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 6,
                    inPlay: [],
                    hand: []
                }
            });
            this.player1.makeMaverick(this.tachyonManifold, 'dis');
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.theEvilEye);
            this.player1.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.player2.player.getCurrentKeyCost()).toBe(6);
            this.player1.endTurn();
            expect(this.player2.player.getCurrentKeyCost()).toBe(9);
            expect(this.player2.player.getForgedKeys()).toBe(0);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
