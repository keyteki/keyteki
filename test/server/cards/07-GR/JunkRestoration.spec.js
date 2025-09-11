describe('Junkyard Restoration', function () {
    describe("Junkyard Restoration's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['junk-restoration'],
                    discard: ['flaxia', 'shadys', 'full-moon']
                },
                player2: {
                    amber: 1
                }
            });
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.shadys, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
        });

        it('discards top 3 of deck', function () {
            let p1deck = this.player1.player.deck.length;
            this.player1.play(this.junkRestoration);
            expect(this.player1.deck.length).toBe(p1deck - Math.min(3, p1deck));
            expect(this.flaxia.location).toBe('discard');
            expect(this.shadys.location).toBe('discard');
            expect(this.fullMoon.location).toBe('discard');
            expect(this.player1.discard.length).toBe(Math.min(3, p1deck));
        });

        it('allows player to put one discarded card into hand', function () {
            this.player1.play(this.junkRestoration);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.shadys);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.flaxia);
            expect(this.flaxia.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('allows player to not put one discarded card into hand', function () {
            this.player1.play(this.junkRestoration);
            this.player1.clickPrompt('Done');
            expect(this.flaxia.location).toBe('discard');
            expect(this.shadys.location).toBe('discard');
            expect(this.fullMoon.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
