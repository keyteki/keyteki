describe('Watched Closely', function () {
    describe("Watched Closely's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    hand: ['watched-closely']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dust-pixie']
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
            this.player1.chains = 36;
        });

        it('should have creature make token for opponent on reap', function () {
            this.player1.playUpgrade(this.watchedClosely, this.dustPixie);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.dustPixie);
            expect(this.wrangler1.location).toBe('play area');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
