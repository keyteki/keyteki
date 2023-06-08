describe('Plunder', function () {
    describe("Plunders's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['plunder']
                },
                player2: {
                    hand: ['troll', 'batdrone']
                }
            });
        });

        it('should discard the first card', function () {
            this.player1.play(this.plunder);
            this.player1.clickPrompt('Discard this card');
            if (this.troll.location === 'hand') {
                expect(this.batdrone.location).toBe('discard');
            } else {
                expect(this.batdrone.location).toBe('hand');
                expect(this.troll.location).toBe('discard');
            }
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should reveal 2 cards and discard the last one', function () {
            this.player1.play(this.plunder);
            this.player1.clickPrompt('Repeat this effect');
            this.player1.clickPrompt('Discard this card');
            if (this.troll.location === 'hand') {
                expect(this.batdrone.location).toBe('discard');
            } else {
                expect(this.batdrone.location).toBe('hand');
                expect(this.troll.location).toBe('discard');
            }
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('can reveal all cards without discarding any', function () {
            this.player1.play(this.plunder);
            this.player1.clickPrompt('Repeat this effect');
            this.player1.clickPrompt('Repeat this effect');
            expect(this.batdrone.location).toBe('hand');
            expect(this.troll.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be playable twice to discard both cards', function () {
            this.player1.play(this.plunder);
            this.player1.clickPrompt('Repeat this effect');
            this.player1.clickPrompt('Discard this card');
            this.player1.moveCard(this.plunder, 'hand');
            this.player1.play(this.plunder);
            this.player1.clickPrompt('Discard this card');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
