describe('Avid Collecting', function () {
    describe("Avid Collecting's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    token: 'trader',
                    amber: 1,
                    hand: ['avid-collecting'],
                    inPlay: [
                        'trader:antiquities-dealer',
                        'trader:sandhopper',
                        'flaxia',
                        'helper-bot'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['gub', 'krump']
                }
            });

            this.token1 = this.player1.inPlay[0];
            this.token2 = this.player1.inPlay[1];
        });

        it('should return all token cards to hand', function () {
            this.player1.play(this.avidCollecting);
            expect(this.player1).toBeAbleToSelect(this.token1);
            expect(this.player1).toBeAbleToSelect(this.token2);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            this.player1.clickCard(this.token2);
            expect(this.token1.location).toBe('play area');
            expect(this.token2.location).toBe('hand');
            expect(this.flaxia.location).toBe('play area');
            expect(this.helperBot.location).toBe('play area');
            this.player1.endTurn();
        });
    });
});
