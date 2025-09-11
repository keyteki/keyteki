describe('SoundTheHorns', function () {
    describe('is played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: [
                        'sound-the-horns',
                        'seeker-needle',
                        'the-warchest',
                        'ganger-chieftain',
                        'shadow-self'
                    ]
                },
                player2: {}
            });

            this.player1.moveCard(this.shadowSelf, 'deck');
            this.player1.moveCard(this.gangerChieftain, 'deck');
            this.player1.moveCard(this.theWarchest, 'deck');
            this.player1.moveCard(this.seekerNeedle, 'deck');
        });

        it('gets brobnar creature', function () {
            this.player1.play(this.soundTheHorns);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.seekerNeedle.location).toBe('discard');
            expect(this.theWarchest.location).toBe('discard');
            expect(this.gangerChieftain.location).toBe('hand');
            expect(this.shadowSelf.location).toBe('deck');
        });
    });
});
