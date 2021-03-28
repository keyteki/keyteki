describe('Kompsos Haruspex', function () {
    describe('when in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'brobnar',
                    inPlay: ['kompsos-haruspex', 'brammo']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'urchin', 'krump']
                }
            });
        });

        it('should make play effects become reap effects too', function () {
            this.player1.reap(this.brammo);

            expect(this.troll.tokens.damage).toBe(2);
            expect(this.krump.tokens.damage).toBe(2);
        });

        describe('when my opponent takes a turn', function () {
            beforeEach(function () {
                this.player1.endTurn();

                this.player2.clickPrompt('shadows');
                this.player2.reap(this.urchin);
            });

            it('should not allow the play effect to trigger on reap', function () {
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(3);
            });
        });
    });
});
