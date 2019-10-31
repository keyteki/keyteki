describe('Fidgit', function() {
    integration(function() {
        describe('Fidgit\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: [],
                        hand: ['fidgit']
                    },
                    player2: {
                        inPlay: ['maruck-the-marked'],
                        hand: ['bulwark'],
                        discard: ['the-warchest', 'troll', 'krump', 'virtuous-works', 'clear-mind']
                    }
                });
            });
            it('when deck and archives are empty, should not have prompt', function() {
                this.player2.player.deck = [];
                this.player2.player.archives = [];
                this.player1.play(this.fidgit);
                expect(this.player1).not.toHavePrompt('Top of deck');
                expect(this.player1).not.toHavePrompt('Random card from archives');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
            it('when deck is empty, play archived card directly', function() {
                this.player2.player.deck = [];
                this.player2.moveCard(this.clearMind, 'archives');
                this.player2.moveCard(this.virtuousWorks, 'archives');
                this.player1.play(this.fidgit);
                expect(this.player1).not.toHavePrompt('Top of deck');
                expect(this.player1).not.toHavePrompt('Random card from archives');

                // Randomness
                if(this.virtuousWorks.location === 'archives') {
                    expect(this.clearMind.location).toBe('discard');
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(0);
                } else {
                    expect(this.virtuousWorks.location).toBe('discard');
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(0);
                }
            });
            it('when archive is empty, play top of deck card directly', function() {
                this.player2.player.archives = [];
                this.player2.moveCard(this.virtuousWorks, 'deck');
                this.player1.play(this.fidgit);
                expect(this.player1).not.toHavePrompt('Top of deck');
                expect(this.player1).not.toHavePrompt('Random card from archives');
                expect(this.virtuousWorks.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(0);
            });
            it('when top of deck is selected, top action card is played', function() {
                this.player2.moveCard(this.virtuousWorks, 'deck');
                this.player2.moveCard(this.clearMind, 'archives');

                this.player1.play(this.fidgit);
                this.player1.clickPrompt('Top of deck');

                expect(this.virtuousWorks.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(0);
            });
            it('when archives is selected, plays a random action card from archives', function() {
                this.player2.moveCard(this.virtuousWorks, 'archives');
                this.player2.moveCard(this.clearMind, 'archives');

                this.player1.play(this.fidgit);
                this.player1.clickPrompt('Random card from archives');

                // Randomness
                if(this.virtuousWorks.location === 'archives') {
                    expect(this.clearMind.location).toBe('discard');
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(0);
                } else {
                    expect(this.virtuousWorks.location).toBe('discard');
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(0);
                }
            });
            it('when top of deck is selected, top artifact card is discarded', function() {
                this.player2.moveCard(this.theWarchest, 'deck');
                this.player2.moveCard(this.clearMind, 'archives');

                this.player1.play(this.fidgit);
                this.player1.clickPrompt('Top of deck');

                expect(this.theWarchest.location).toBe('discard');
            });
            it('when archives is selected, discards a random creature card from archives', function() {
                this.player2.moveCard(this.troll, 'archives');
                this.player2.moveCard(this.krump, 'archives');

                this.player1.play(this.fidgit);
                this.player1.clickPrompt('Random card from archives');

                // Randomness
                if(this.krump.location === 'archives') {
                    expect(this.troll.location).toBe('discard');
                } else {
                    expect(this.krump.location).toBe('discard');
                }
            });
        });
    });
});
