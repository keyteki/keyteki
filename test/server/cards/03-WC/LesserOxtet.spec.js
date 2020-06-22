describe('Lesser Oxtet', function () {
    describe('card abilities', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: [
                        'lesser-oxtet',
                        'phase-shift',
                        'virtuous-works',
                        'batdrone',
                        'dextre',
                        'batdrone'
                    ]
                },
                player2: {
                    inPlay: ['zorg'],
                    amber: 5
                }
            });
        });

        describe('when the card is played', function () {
            beforeEach(function () {
                this.player1.play(this.lesserOxtet);
            });

            it('should purge all cards in hand when played', function () {
                expect(this.player1.player.hand.length).toBe(0);
                expect(this.player1.player.purged.length).toBe(5);
            });
        });

        describe('when the card is used to reap', function () {
            beforeEach(function () {
                this.player1.play(this.lesserOxtet);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                this.player2.endTurn();
                this.player2.player.amber = 6;
                this.player1.clickPrompt('dis');
            });

            it('should stop a key being forged', function () {
                this.player1.reap(this.lesserOxtet);
                this.player1.endTurn();
                expect(this.player2.player.getForgedKeys()).toBe(0);
                expect(this.player2.player.amber).toBe(6);
            });
        });
    });
});
