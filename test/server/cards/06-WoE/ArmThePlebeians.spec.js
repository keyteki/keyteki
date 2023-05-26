describe('Arm the Plebeians', function () {
    describe("Arm the Plebeians's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    token: 'scholar',
                    hand: ['arm-the-plebeians', 'full-moon', 'archimedes'],
                    inPlay: ['flaxia', 'helper-bot']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should make a single token out of a creature and ward it', function () {
            this.player1.moveCard(this.archimedes, 'deck');
            this.player1.play(this.armThePlebeians);
            this.player1.clickPrompt('Left');
            let scholar = this.player1.inPlay[0];
            expect(scholar.id).toBe('archimedes');
            expect(scholar.name).toBe('Scholar');
            expect(scholar.exhausted).toBe(true);
            expect(scholar.warded).toBe(true);
        });

        it('should make a single token out of an action card and ward it', function () {
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.play(this.armThePlebeians);
            this.player1.clickPrompt('Left');
            let scholar = this.player1.inPlay[0];
            expect(scholar.id).toBe('full-moon');
            expect(scholar.name).toBe('Scholar');
            expect(scholar.exhausted).toBe(true);
            expect(scholar.warded).toBe(true);
        });
    });
});
