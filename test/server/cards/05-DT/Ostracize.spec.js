describe('Ostracize', function () {
    describe("Ostracize's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    hand: ['ostracize'],
                    inPlay: ['hookmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        it('if an amber is lost, purge a creature', function () {
            this.player1.play(this.ostracize);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).toBeAbleToSelect(this.hookmaster);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            this.player1.clickCard(this.murkens);
            expect(this.murkens.location).toBe('purged');
        });

        it('if an amber is not lost, should not purge a creature', function () {
            this.player1.amber = 0;
            this.player1.play(this.ostracize);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
