describe('Fuzzy Gruen', function () {
    describe("Fuzzy Gruen's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    hand: ['fuzzy-gruen']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        it('should not make opponent gain 1 amber', function () {
            this.player1.play(this.fuzzyGruen);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(3);
        });
    });
});
