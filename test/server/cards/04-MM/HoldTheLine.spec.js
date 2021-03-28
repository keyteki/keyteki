describe('Hold the Line', function () {
    describe("Hold the Line's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['kartanoo'],
                    hand: ['hold-the-line', 'calv-1n', 'explo-rover']
                },
                player2: {
                    inPlay: ['troll', 'alaka', 'brammo']
                }
            });
        });

        it('should draw 2 cards since there are more enemies than friendly creatures', function () {
            this.player1.play(this.holdTheLine);
            expect(this.player1.player.hand.length).toBe(4);
        });

        it('should not draw cards since there are same number of enemies and friendly creatures', function () {
            this.player1.play(this.calv1n);
            this.player1.play(this.exploRover);
            this.player1.play(this.holdTheLine);
            expect(this.player1.player.hand.length).toBe(0);
        });
    });
});
