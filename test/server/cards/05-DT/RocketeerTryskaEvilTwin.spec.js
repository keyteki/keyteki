describe('Rocketeer Tryska Evil Twin', function () {
    describe("Rocketeer Tryska Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    hand: ['rocketeer-tryska-evil-twin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        it('when the tide is neutral, should enter play exhausted', function () {
            this.player1.play(this.rocketeerTryskaEvilTwin);
            expect(this.rocketeerTryskaEvilTwin.exhausted).toBe(true);
        });

        it('when the tide is low, should enter play exhausted', function () {
            this.player1.lowerTide();
            this.player1.play(this.rocketeerTryskaEvilTwin);
            expect(this.rocketeerTryskaEvilTwin.exhausted).toBe(true);
        });

        it('when the tide is high, should enter play exhausted', function () {
            this.player1.raiseTide();
            this.player1.play(this.rocketeerTryskaEvilTwin);
            expect(this.rocketeerTryskaEvilTwin.exhausted).toBe(false);
        });
    });
});
