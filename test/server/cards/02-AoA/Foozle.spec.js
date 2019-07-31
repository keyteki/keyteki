describe('Foozle', function() {
    integration(function() {
        describe('Foozle\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['bingle-bangbang', 'foozle'],
                        hand: ['punch']
                    },
                    player2: {
                        inPlay: ['brend-the-fanatic']
                    }
                });
            });

            it('gain 1 amber by reaping if no creatures have been destroyed', function() {
                this.player1.reap(this.foozle);
                expect(this.player1.amber).toBe(1);
            });
            it('gain 2 amber by reaping if a creature has been destroyed in a fight', function() {
                this.player1.fightWith(this.bingleBangbang, this.brendTheFanatic);
                this.player1.reap(this.foozle);
                expect(this.player1.amber).toBe(2);
            });
            it('gain 2 amber by reaping if a creature has been destroyed by direct damage', function() {
                this.player1.play(this.punch);
                this.player1.clickCard(this.bingleBangbang);
                this.player1.reap(this.foozle);
                expect(this.player1.amber).toBe(3);
            });
        });
    });
});
