describe('Alpha-Gamma', function () {
    describe("Alpha-Gamma's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    token: 'alpha-gamma',
                    inPlay: ['alpha-gamma:gub', 'helper-bot']
                },
                player2: {
                    inPlay: ['troll']
                }
            });

            this.alphaGamma1 = this.player1.player.creaturesInPlay[0];
        });

        it('should archive itself when destroyed', function () {
            this.player1.fightWith(this.alphaGamma1, this.troll);
            expect(this.alphaGamma1.location).toBe('archives');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
