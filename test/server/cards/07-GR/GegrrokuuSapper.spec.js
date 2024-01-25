describe('Gegrrokuu Sapper', function () {
    describe("Gegrrokuu Sapper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['gegrrŏkŭŭ-sapper'],
                    inPlay: ['seeker-needle', 'uncommon-currency', 'the-old-tinker']
                },
                player2: {
                    amber: 1,
                    inPlay: ['quixxle-stone', 'cpo-zytar']
                }
            });
        });

        it('swaps itself with an artifact on play', function () {
            this.player1.play(this.gegrrŏkŭŭSapper);
            expect(this.player1).not.toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).not.toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player1).toBeAbleToSelect(this.quixxleStone);
            this.player1.clickCard(this.quixxleStone);
            this.player1.clickPrompt('Left');
            expect(this.quixxleStone.controller).toBe(this.player1.player);
            expect(this.gegrrŏkŭŭSapper.controller).toBe(this.player2.player);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('swaps itself with an artifact on fight', function () {
            this.player1.play(this.gegrrŏkŭŭSapper);
            this.player1.clickCard(this.quixxleStone);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.fightWith(this.gegrrŏkŭŭSapper, this.theOldTinker);
            expect(this.player2).toBeAbleToSelect(this.seekerNeedle);
            expect(this.player2).toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player2).toBeAbleToSelect(this.quixxleStone);
            this.player2.clickCard(this.seekerNeedle);
            this.player2.clickPrompt('Right');
            expect(this.seekerNeedle.controller).toBe(this.player2.player);
            expect(this.gegrrŏkŭŭSapper.controller).toBe(this.player1.player);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can destroy friendly and enemy artifact on scrap', function () {
            this.player1.clickCard(this.gegrrŏkŭŭSapper);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player1).not.toBeAbleToSelect(this.quixxleStone);
            this.player1.clickCard(this.seekerNeedle);
            expect(this.seekerNeedle.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player1).toBeAbleToSelect(this.quixxleStone);
            this.player1.clickCard(this.quixxleStone);
            expect(this.quixxleStone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('must destroy friendly artifact to destroy enemy artifact on scrap', function () {
            this.player1.moveCard(this.seekerNeedle, 'discard');
            this.player1.moveCard(this.uncommonCurrency, 'discard');
            this.player1.clickCard(this.gegrrŏkŭŭSapper);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
