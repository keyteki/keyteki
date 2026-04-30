describe('Hemogrith', function () {
    describe("Hemogrith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['hemogrith']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'urchin']
                }
            });
        });

        it('opponent loses 2 amber when no enemy creatures are exhausted', function () {
            this.player1.play(this.hemogrith);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when an enemy creature is exhausted', function () {
            this.troll.exhaust();
            this.player1.play(this.hemogrith);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('opponent loses 2 amber when there are no enemy creatures at all', function () {
            this.player2.moveCard(this.troll, 'hand');
            this.player2.moveCard(this.urchin, 'hand');
            this.player1.play(this.hemogrith);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
