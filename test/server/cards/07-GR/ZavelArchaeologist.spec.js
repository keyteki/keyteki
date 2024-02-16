describe('Zavel Archaeologist', function () {
    describe("Zavel Archaeologist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['zavel-archaeologist', 'sandhopper'],
                    inPlay: ['seeker-needle'],
                    discard: ['cpo-zytar', 'ornate-talking-tray', 'lucky-dice']
                },
                player2: {
                    discard: ['quixxle-stone']
                }
            });
        });

        it('plays an artifact from discard and gains 1 on play', function () {
            this.player1.playCreature(this.zavelArchaeologist);
            expect(this.player1).toBeAbleToSelect(this.ornateTalkingTray);
            expect(this.player1).toBeAbleToSelect(this.luckyDice);
            expect(this.player1).not.toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).not.toBeAbleToSelect(this.sandhopper);
            expect(this.player1).not.toBeAbleToSelect(this.quixxleStone);
            this.player1.clickCard(this.ornateTalkingTray);
            expect(this.player1.amber).toBe(3);
            expect(this.ornateTalkingTray.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('gains no amber from an artifact played from hand', function () {
            this.player1.playCreature(this.zavelArchaeologist);
            this.player1.clickPrompt('Done');
            this.player1.play(this.sandhopper);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('is optional', function () {
            this.player1.playCreature(this.zavelArchaeologist);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('plays an artifact from discard and gains 1 on reap', function () {
            this.player1.playCreature(this.zavelArchaeologist);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.reap(this.zavelArchaeologist);
            this.player1.clickCard(this.luckyDice);
            expect(this.player1.amber).toBe(4);
            expect(this.luckyDice.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
