describe('Faygin', function () {
    describe("Faygin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['urchin'],
                    inPlay: ['faygin']
                },
                player2: {}
            });
        });

        it('should return urchin from play', function () {
            this.player1.play(this.urchin);
            this.player1.reap(this.faygin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should return urchin from discard', function () {
            this.player1.scrap(this.urchin);
            this.player1.reap(this.faygin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
