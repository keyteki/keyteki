describe('Wrangler', function () {
    describe("Wrangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    inPlay: ['wrangler:toad', 'bux-bastian']
                },
                player2: {
                    amber: 2
                }
            });

            this.wrangler1 = this.player1.player.creaturesInPlay[0];
        });

        it('should cause each player to gain 1A on action', function () {
            this.player1.useAction(this.wrangler1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
