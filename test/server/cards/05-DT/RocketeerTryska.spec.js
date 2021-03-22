describe('Rocketeer Tryska', function () {
    describe("Rocketeer Tryska's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska'],
                    hand: ['armsmaster-molina', 'sensor-chief-garcia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is not high', function () {
            it('a neighbor should not enter play ready', function () {
                this.player1.play(this.armsmasterMolina);
                expect(this.armsmasterMolina.location).toBe('play area');
                expect(this.armsmasterMolina.exhausted).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('a neighbor should not enter play ready', function () {
                this.player1.play(this.armsmasterMolina);
                expect(this.armsmasterMolina.location).toBe('play area');
                expect(this.armsmasterMolina.exhausted).toBe(false);
            });
        });
    });
});
