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

        describe('when the tide is low', function () {
            it('a neighbor should not be ready on play', function () {
                this.player1.play(this.armsmasterMolina);
                expect(this.armsmasterMolina.location).toBe('play area');
                expect(this.armsmasterMolina.exhausted).toBe(true);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('a neighbor should be ready on play', function () {
                this.player1.play(this.armsmasterMolina);
                expect(this.armsmasterMolina.location).toBe('play area');
                expect(this.armsmasterMolina.exhausted).toBe(false);
            });
        });
    });

    describe("Rocketeer Tryska's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    token: 'niffle-brute',
                    house: 'untamed',
                    inPlay: ['rocketeer-tryska', 'gebuk'],
                    hand: ['armsmaster-molina', 'waste-not', 'survival-of-the-richest']
                },
                player2: {}
            });
            this.player1.raiseTide();
        });

        it('neighbors should enter play ready', function () {
            this.player1.moveCard(this.armsmasterMolina, 'deck');
            expect(this.armsmasterMolina.location).toBe('deck');
            this.player1.play(this.wasteNot);
            this.player1.clickCard(this.gebuk);
            expect(this.armsmasterMolina.location).toBe('play area');
            expect(this.armsmasterMolina.exhausted).toBe(false);
        });

        it('a neighbor should not enter play ready', function () {
            this.niffleBrute1 = this.player1.player.deck[0];
            this.player1.play(this.survivalOfTheRichest);
            this.player1.clickPrompt('Left');
            expect(this.niffleBrute1.location).toBe('play area');
            expect(this.niffleBrute1.exhausted).toBe(false);
        });
    });
});
