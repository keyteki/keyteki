describe('umbra-fiend', function () {
    describe("Umbra-Fiend's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['umbra-fiend']
                },
                player2: {
                    amber: 1,
                    inPlay: ['umbra']
                }
            });
        });

        it('should steal an amber when destroyed', function () {
            this.player1.fightWith(this.umbraFiend, this.umbra);
            expect(this.umbraFiend.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
});
