describe('Hunter of Legend', function () {
    describe("Hunter of Legend's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'wrangler',
                    hand: ['hunter-of-legend'],
                    inPlay: ['bux-bastian']
                },
                player2: {
                    amber: 6,
                    inPlay: ['umbra']
                }
            });

            this.wrangler1 = this.player1.player.deck[0];
        });

        it('should give creature skirmish and ability to make a token creature on fight', function () {
            this.player1.playUpgrade(this.hunterOfLegend, this.buxBastian);
            this.player1.fightWith(this.buxBastian, this.umbra);
            this.player1.clickPrompt('Right');
            expect(this.buxBastian.damage).toBe(0);
            expect(this.wrangler1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
