describe('Tachyon Manifold', function () {
    describe("Tachyon Manifold's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['stealth-mode'],
                    inPlay: ['tachyon-manifold', 'cpo-zytar']
                },
                player2: {
                    hand: ['groke']
                }
            });
        });

        it('gives player another turn and opponent draws 10 cards', function () {
            this.player1.useAction(this.tachyonManifold);
            expect(this.player2.player.hand.length).toBe(11);
            expect(this.tachyonManifold.location).toBe('purged');
            this.player1.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.cpoZytar);
            this.player1.play(this.stealthMode);
            this.player1.endTurn();
            expect(this.player1.player.hand.length).toBe(6);
            this.player2.clickPrompt('brobnar');
        });

        it('used twice in one turn gives player two more turns in a row', function () {
            // Use Tachyon Manifold twice
            this.player1.useAction(this.tachyonManifold);
            this.player1.moveCard(this.tachyonManifold, 'play area');
            this.tachyonManifold.exhausted = false;
            this.player1.useAction(this.tachyonManifold);
            this.player1.endTurn();

            // Take 2 more turns
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.cpoZytar);
            this.player1.endTurn();
            this.player1.clickPrompt('staralliance');
            this.player1.reap(this.cpoZytar);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
        });
    });
});
