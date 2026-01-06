describe('Legendary Keyraken', function () {
    describe("Legendary Keyraken's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 12,
                    house: 'keyraken',
                    inPlay: ['legendary-keyraken', 'crushing-tentacle']
                },
                player2: {
                    amber: 6,
                    hand: ['wail-of-the-damned']
                }
            });
        });

        it('increases by 5 power with friendly forged keys', function () {
            expect(this.legendaryKeyraken.power).toBe(10);
            this.player1.endTurn();
            this.player2.clickPrompt('red');
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('red');
            expect(this.legendaryKeyraken.power).toBe(15);
            this.player1.clickPrompt('keyraken');
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('blue');
            expect(this.legendaryKeyraken.power).toBe(20);
            this.player1.clickPrompt('keyraken');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
