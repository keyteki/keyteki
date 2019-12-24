describe('Barehanded', function() {
    integration(function() {
        describe('when played', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['banner-of-battle', 'troll', 'bad-penny', 'seeker-needle'],
                        hand: ['barehanded']
                    },
                    player2: {
                        inPlay: ['urchin', 'krump', 'the-warchest', 'safe-place']
                    }
                });

                this.player1.play(this.barehanded);
            });

            it('should return player1 artifacts to the top of their deck', function() {
                expect(this.seekerNeedle.location).toBe('deck');
            });

            it('should return player2 artifacts to the top of their deck', function() {
                expect(this.theWarchest.location).toBe('deck');
                expect(this.safePlace.location).toBe('deck');
            });
        });
    });
});
