describe('Murkens', function() {
    integration(function() {
        describe('Murkens\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        amber: 2,
                        inPlay: [],
                        hand: ['murkens']
                    },
                    player2: {
                        amber: 0,
                        inPlay: ['maruck-the-marked', 'teliga'],
                        hand: ['bulwark', 'persistence-hunting'],
                        archives: ['grenade-snib'],
                        discard: ['the-warchest', 'troll']
                    }
                });
                this.player2.moveCard(this.troll, 'deck');
            });

            it('when top of deck is selected, top card is played', function() {
                this.player1.play(this.murkens);
                this.player1.clickPrompt('Top of deck');
                this.player1.clickPrompt('Left');

                expect(this.troll.controller).toBe(this.player1.player);
                this.player1.endTurn();
                expect(this.player2).toHavePrompt('House Choice');
                expect(this.troll.controller).toBe(this.player1.player);
            });

            it('when archives is selected, plays a random card from archives', function() {
                this.player1.play(this.murkens);
                this.player1.clickPrompt('Random card from archives');
                this.player1.clickPrompt('Left');

                expect([this.theWarchest, this.grenadeSnib].map(card => card.controller).some(c => c === this.player1.player)).toBe(true);
            });

            it('when archives is empty, top card is played', function() {
                this.player2.drawCardsFromArchives();
                this.player1.play(this.murkens);

                expect(this.troll.controller).toBe(this.player1.player);
                this.player1.endTurn();
                expect(this.player2).toHavePrompt('House Choice');
                expect(this.troll.controller).toBe(this.player1.player);
            });

            it('when deck is empty, plays a random card from archives', function() {
                this.player2.drawCardsToHand(10);
                this.player1.play(this.murkens);

                expect([this.theWarchest, this.grenadeSnib].map(card => card.controller).some(c => c === this.player1.player)).toBe(true);
            });

            it('when archives is selected, plays a random card with Play ability from archives', function() {
                this.player2.drawCardsFromArchives();
                this.player2.moveCard('persistence-hunting', 'archives', 'hand');
                this.player1.play(this.murkens);
                this.player1.clickPrompt('Random card from archives');

                expect(this.player1).toHavePrompt('Choose a house');
                this.player1.clickPrompt('untamed');
                expect(this.teliga.exhausted).toBe(true);
            });
        });
    });
});
