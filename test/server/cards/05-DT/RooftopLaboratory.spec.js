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

        it('friendly scientists should not enter play ready when Rooftop Laboratory is not in play.', function () {
            this.player1.moveCard(this.rooftopLaboratory, 'deck');
            this.player1.play(this.dextre);
            this.player1.play(this.hapsis);
            expect(this.dextre.exhausted).toBe(true);
            expect(this.hapsis.exhausted).toBe(true);
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
