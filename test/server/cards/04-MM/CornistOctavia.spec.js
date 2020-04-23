describe('cornist-octavia', function () {
    integration(function () {
        describe('Cornist Octavia\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'saurian',
                        inPlay: ['cornist-octavia']
                    },
                    player2: {
                        amber: 4
                    }
                });
            });

            it('should capture two amber as an action', function() {
                expect(this.player2.amber).toBe(4);
                expect(this.cornistOctavia.tokens.amber).toBe(0);

                this.player1.useAction(this.cornistOctavia);

                expect(this.player2.amber).toBe(2);
                expect(this.cornistOctavia.tokens.amber).toBe(2);
            });
        });
    });
});
