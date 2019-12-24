describe('Batdrone', function() {
    integration(function() {
        describe('when fighting', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        amber: 1,
                        house: 'logos',
                        inPlay: ['batdrone'],
                        hand: ['barehanded']
                    },
                    player2: {
                        amber: 3,
                        inPlay: ['urchin', 'krump', 'the-warchest', 'safe-place']
                    }
                });

                this.player1.fightWith(this.batdrone, this.urchin);
            });

            it('should steal an amber from the opponent', function() {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(2);
            });
        });
    });
});
