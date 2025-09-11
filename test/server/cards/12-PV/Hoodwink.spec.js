describe('Hoodwink', function () {
    describe("Hoodwink's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['hoodwink', 'urchin', 'ember-imp', 'duskwitch', 'nerve-blast'],
                    amber: 0
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('should steal 1 amber for each non-Shadows card in hand', function () {
            this.player1.play(this.hoodwink);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.hoodwink.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not steal amber if all cards are Shadows', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.duskwitch, 'discard');
            this.player1.play(this.hoodwink);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
            expect(this.hoodwink.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should purge itself after stealing', function () {
            this.player1.play(this.hoodwink);
            expect(this.hoodwink.location).toBe('purged');
            expect(this.player1.discard).not.toContain(this.hoodwink);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
