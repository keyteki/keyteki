describe('Begone!', function () {
    describe("Begone!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['lamindra'],
                    hand: ['shooler']
                },
                player2: {
                    inPlay: ['maruck-the-marked'],
                    hand: ['begone']
                }
            });
        });

        it('gain amber if there is no Dis in play', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.begone);
            expect(this.player2.amber).toBe(1);
        });
    });
});
