describe('City-State Interest', function() {
    integration(function() {
        describe('City-State Interest\'s play ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['troll', 'valdr', 'krump'],
                        hand: ['city-state-interest']
                    },
                    player2: {
                        amber: 6,
                        inPlay: ['lamindra']
                    }
                });
            });

            it('Play will make each friendly creature capture 1 amber', function() {
                this.player1.play(this.cityStateInterest);

                expect(this.troll.tokens.amber).toBe(1);
                expect(this.valdr.tokens.amber).toBe(1);
                expect(this.krump.tokens.amber).toBe(1);
                expect(this.lamindra.hasToken('amber')).toBe(false);
            });
        });
    });
});
