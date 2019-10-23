xdescribe('The Grim Reaper(WC)', function() {
    integration(function() {
        describe('Playing the Grim Reaper:', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        hand: ['the-grim-reaper','anger'],
                        discard: ['poke','poke','poke','poke','poke','poke','poke','poke','poke']
                    },
                    player2: {
                        house: 'brobnar',
                        hand: ['poke'],
                        discard: ['poke','poke','poke','poke','poke','poke','poke','poke','poke','poke']
                    }
                });
            });

            it('with 9 cards in discard, grim reaper should enter exhausted', function() {
                expect(this.player1.player.isHaunted()).toBe(false);
                expect(this.player2.player.isHaunted()).toBe(true);
                this.player1.play(this.theGrimReaper);
                expect(this.theGrimReaper.exhausted).toBe(true);
            });

            it('with 10 cards in discard, grim reaper should enter ready', function() {
                this.player1.moveCard(this.anger, 'discard');
                expect(this.player1.player.isHaunted()).toBe(true);
                this.player1.play(this.theGrimReaper);
                expect(this.theGrimReaper.exhausted).toBe(false);
                expect(this).toHaveRecentChatMessage('player1 uses The Grim Reaper to ready The Grim Reaper');
            });
        });
    });
});
