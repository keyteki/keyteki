describe('One-Eyed Willa Evil Twin', function () {
    describe("One-Eyed Willa Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra', 'one-eyed-willa-evil-twin'],
                    hand: []
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        describe('while the tide is not high and fight', function () {
            beforeEach(function () {
                this.player1.fightWith(this.oneEyedWillaEvilTwin, this.troll);
            });

            it('should not make opponent lose 2A', function () {
                expect(this.oneEyedWillaEvilTwin.location).toBe('play area');
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(2);
            });
        });

        describe('while the tide is high and fight', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.fightWith(this.oneEyedWillaEvilTwin, this.troll);
            });

            it('should make opponent lose 2A', function () {
                expect(this.oneEyedWillaEvilTwin.location).toBe('play area');
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
            });
        });
    });
});
