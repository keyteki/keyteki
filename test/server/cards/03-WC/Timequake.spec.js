describe('Lateral Shift', function() {
    integration(function() {
        describe('Lateral Shift\'s omni ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        amber: 2,
                        inPlay: ['lamindra', 'murkens', 'orb-of-wonder'],
                        hand: ['timequake', 'troll', 'redlock']
                    },
                    player2: {
                        amber: 1,
                        inPlay: ['bulwark']
                    }
                });
            });

            it('should return 2 cards in play to deck and draw 2 cards', function() {
                expect(this.player1.player.cardsInPlay.length).toBe(3);
                expect(this.player1.player.hand.length).toBe(3);

                this.player1.play(this.timequake);

                expect(this.player1.player.cardsInPlay.length).toBe(0);
                expect(this.player1.player.hand.length).toBe(5);
            });

            it('should not count cards under other cards', function() {
                expect(this.player1.player.cardsInPlay.length).toBe(3);
                expect(this.player1.player.hand.length).toBe(3);

                this.player1.play(this.timequake);

                expect(this.player1.player.cardsInPlay.length).toBe(0);
                expect(this.player1.player.hand.length).toBe(5);
            });

            it('should return not draw any card if nothing is in play', function() {
                this.player1.player.removeCardFromPile(this.lamindra);
                this.player1.player.removeCardFromPile(this.murkens);

                this.lamindra.parent = this.orbOfWonder;
                this.lamindra.facedown = true;
                this.orbOfWonder.childCards.push(this.lamindra);

                this.murkens.parent = this.orbOfWonder;
                this.murkens.facedown = false;
                this.orbOfWonder.childCards.push(this.murkens);

                expect(this.player1.player.cardsInPlay.length).toBe(1);
                expect(this.player1.player.hand.length).toBe(3);

                this.player1.play(this.timequake);

                expect(this.player1.player.cardsInPlay.length).toBe(0);
                expect(this.player1.player.hand.length).toBe(3);
            });
        });
    });
});
