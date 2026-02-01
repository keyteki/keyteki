describe('Aubade the Grim', function () {
    describe("Aubade the Grim's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['aubade-the-grim']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should capture 3 amber on play', function () {
            this.player1.play(this.aubadeTheGrim);
            expect(this.aubadeTheGrim.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard 1 amber on reap', function () {
            this.player1.play(this.aubadeTheGrim);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();

            this.player1.clickPrompt('sanctum');
            this.player1.reap(this.aubadeTheGrim);
            expect(this.aubadeTheGrim.amber).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
