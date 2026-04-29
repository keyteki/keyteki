describe('Shikari', function () {
    describe("Shikari's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    hand: ['shikari']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dust-pixie', 'troll']
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
        });

        it('should make a token creature on play', function () {
            this.player1.play(this.shikari);
            this.player1.clickPrompt('Right');
            expect(this.wrangler1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return to hand on fight', function () {
            this.player1.play(this.shikari);
            this.player1.clickPrompt('Right');
            this.shikari.ready();
            this.player1.fightWith(this.shikari, this.dustPixie);
            expect(this.shikari.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.shikari);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not return to hand when destroyed in fight', function () {
            this.player1.play(this.shikari);
            this.player1.clickPrompt('Right');
            this.shikari.ready();
            this.player1.fightWith(this.shikari, this.troll);
            expect(this.shikari.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
