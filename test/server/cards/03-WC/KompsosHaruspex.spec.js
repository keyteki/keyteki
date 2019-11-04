describe('Kompsos Haruspex', function() {
    integration(function() {
        describe('when in play', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['kompsos-haruspex', 'brammo']
                    },
                    player2: {
                        amber: 2,
                        inPlay: ['troll', 'krump']
                    }
                });
            });

            it('should make play effects become reap effects too', function() {
                this.player1.reap(this.brammo);

                expect(this.troll.tokens.damage).toBe(2);
                expect(this.krump.tokens.damage).toBe(2);
            });
        });
    });
});
