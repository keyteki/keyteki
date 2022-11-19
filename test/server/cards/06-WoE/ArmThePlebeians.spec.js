describe('Arm the Plebeians', function () {
    describe("Arm the Plebeians's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    token: 'scholar',
                    hand: ['arm-the-plebeians'],
                    inPlay: ['flaxia', 'helper-bot']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
            this.versusCard = this.player1.deck[0];
        });

        it('should make a single token and ward it', function () {
            this.player1.play(this.armThePlebeians);
            this.player1.clickPrompt('Left');
            let scholar = this.player1.inPlay[0];
            expect(scholar.id).toBe('scholar');
            expect(scholar.versusCard).toBe(this.versusCard);
            expect(scholar.exhausted).toBe(true);
            expect(scholar.warded).toBe(true);
        });
    });
});
