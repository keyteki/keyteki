describe('Titan Engineer', function () {
    describe("Titan engineer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 6,
                    inPlay: ['cephaloist', 'the-shadowsmith'],
                    hand: ['titan-engineer', 'dextre']
                },
                player2: {
                    inPlay: ['bull-wark', 'urchin']
                }
            });
        });

        it('should not increase key cost when on a flank', function () {
            this.player1.play(this.titanEngineer);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            expect(this.player1).toHavePrompt('Forge a key');
        });

        it('should increase key cost when not on a flank', function () {
            this.player1.play(this.titanEngineer);
            this.player1.play(this.dextre);

            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();

            expect(this.player1).not.toHavePrompt('Forge a key');
        });

        it('should not increase opponent key cost when on a flank', function () {
            this.player1.play(this.titanEngineer);
            this.player2.player.amber = 6;

            this.player1.endTurn();
            expect(this.player2).toHavePrompt('Forge a key');
        });

        it('should increase opponent key cost when not on a flank', function () {
            this.player1.play(this.titanEngineer);
            this.player1.play(this.dextre);
            this.player2.player.amber = 6;

            this.player1.endTurn();

            expect(this.player2).not.toHavePrompt('Forge a key');
        });
    });
});
