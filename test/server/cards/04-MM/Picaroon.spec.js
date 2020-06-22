describe('Picaroon', function () {
    integration(function () {
        describe("Picaroon's ability", function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        amber: 2,
                        house: 'dis',
                        inPlay: ['bad-penny', 'picaroon', 'drumble'],
                        hand: ['picaroon']
                    },
                    player2: {
                        amber: 8,
                        inPlay: ['bull-wark', 'bulwark']
                    }
                });
            });

            it('when no changeling neighbors, power should be set to the sum of its neighbors', function () {
                expect(this.picaroon.power).toBe(3);
            });

            it("should increase opponent's amber if friendly Mutant creatures' count is greater", function () {
                this.player1.play(this.player1.hand[0], true, true);
                this.player1.clickCard(this.picaroon);

                expect(this.picaroon.power).toBe(2);
                // The other picaroon
                expect(this.player1.player.creaturesInPlay[1].power).toBe(1);
            });
        });
    });
});
