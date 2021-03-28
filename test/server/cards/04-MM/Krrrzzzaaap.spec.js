describe('Krrrzzzaaap', function () {
    describe("Krrrzzzaaap's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['krrrzzzaaap'],
                    inPlay: ['keyfrog', 'dextre', 'professor-terato']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should destroy all non mutant creatures and gain 1 chain', function () {
            this.player1.play(this.krrrzzzaaap);

            expect(this.dextre.location).toBe('deck');
            expect(this.professorTerato.location).toBe('play area');
            expect(this.player1.chains).toBe(1);
        });
    });
});
