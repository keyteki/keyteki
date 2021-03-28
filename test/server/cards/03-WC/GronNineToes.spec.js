describe('Gron Nine Toes', function () {
    describe("Gron Nine Toes' Ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 1,
                    hand: ['ballcano'],
                    inPlay: ['gron-nine-toes']
                },
                player2: {
                    amber: 4,
                    hand: ['poison-wave']
                }
            });
        });

        it('should get a +4 power boost if it has non-lethal damage', function () {
            this.player1.play(this.ballcano);
            expect(this.gronNineToes.tokens.damage).toBe(4);
            expect(this.gronNineToes.power).toBe(9);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.poisonWave);
            expect(this.gronNineToes.tokens.damage).toBe(6);
            expect(this.gronNineToes.power).toBe(9);
        });
    });
});
