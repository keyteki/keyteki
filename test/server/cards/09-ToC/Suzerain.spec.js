describe('Suzerain', function () {
    describe("Suzerain's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    token: 'minion',
                    inPlay: ['suzerain']
                },
                player2: {
                    amber: 1
                }
            });

            this.p1deck1 = this.player1.player.deck[0];
            this.p1deck2 = this.player1.player.deck[1];
            this.p2deck1 = this.player2.player.deck[0];
        });

        it('should purge own top of deck on reap', function () {
            this.player1.reap(this.suzerain);
            this.player1.clickPrompt('Mine');
            expect(this.p1deck1.location).toBe('purged');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.p1deck2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should purge opponent top of deck on reap', function () {
            this.player1.reap(this.suzerain);
            this.player1.clickPrompt("Opponent's");
            expect(this.p2deck1.location).toBe('purged');
            this.player1.clickPrompt('Left');
            expect(this.player1.player.creaturesInPlay[0]).toBe(this.p1deck1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not make a token if no card was purged', function () {
            this.player2.player.deck = [];
            this.player1.reap(this.suzerain);
            this.player1.clickPrompt("Opponent's");
            expect(this.player2.player.purged.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
