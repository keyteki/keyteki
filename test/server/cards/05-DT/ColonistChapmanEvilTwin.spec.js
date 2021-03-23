describe('Colonist Chapman Evil Twin', function () {
    describe("Colonist Chapman's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['snufflegator', 'colonist-chapman-evil-twin', 'armsmaster-molina']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.colonistChapmanEvilTwin);
            });

            it('should capture all amber from both players', function () {
                expect(this.colonistChapmanEvilTwin.amber).toBe(5);
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(0);
            });
        });
    });
});
