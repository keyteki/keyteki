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
                        hand: ['bulwark'],
                        archives: ['the-warchest', 'grenade-snib'],
                        discard: ['troll']
                    }
                });
                this.player2.moveCard(this.troll, 'deck');
            });

            it('when top of deck is selected, top card is played', function() {
                this.player1.play(this.murkens);
                this.player1.clickPrompt('Top of deck');
                this.player1.clickPrompt('Left');

                expect(this.troll.controller).toBe(this.player1.player);
            });

            it('when archives is selected, plays a random card from archives', function() {
                this.player1.play(this.murkens);
                this.player1.clickPrompt('Random card from archives');

                expect([this.theWarchest, this.grenadeSnib].map(card => card.controller).some(c => c === this.player1.player)).toBe(true);
            });
        });
    });
});
