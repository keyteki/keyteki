describe('Rooftop Laboratory', function () {
    describe("Rooftop Laboratory's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: ['dextre', 'hapsis', 'chronus'],
                    inPlay: ['rooftop-laboratory']
                },
                player2: {
                    amber: 4,
                    hand: ['mindwarper', 'krump']
                }
            });
        });

        it('friendly scientists should enter play ready.', function () {
            this.player1.play(this.dextre);
            this.player1.play(this.hapsis);
            expect(this.dextre.exhausted).toBe(false);
            expect(this.hapsis.exhausted).toBe(false);
        });

        it('friendly non-scientists should not enter play ready.', function () {
            this.player1.play(this.chronus);
            expect(this.chronus.exhausted).toBe(true);
        });

        it('enemy scientists should not enter play ready.', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.mindwarper);
            expect(this.mindwarper.exhausted).toBe(true);
        });
    });
});
