describe('Trawler', function () {
    describe('Trawler', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['trawler', 'crushing-deep'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 6
                }
            });
        });

        it('does nothing when not haunted', function () {
            this.player1.play(this.trawler);
            expect(this.player2.amber).toBe(6);
            expect(this.trawler.tokens.amber).toBe(undefined);
        });

        it('captures all opponent amber when haunted', function () {
            this.player1.play(this.crushingDeep);
            this.player1.play(this.trawler);
            expect(this.player2.amber).toBe(0);
            expect(this.trawler.tokens.amber).toBe(6);
        });
    });
});
