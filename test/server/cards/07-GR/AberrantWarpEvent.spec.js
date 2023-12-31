describe('AberrantWarpEvent', function () {
    describe('is played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: [
                        'aberrant-warp-event',
                        'seeker-needle',
                        'the-warchest',
                        'ganger-chieftain',
                        'shadow-self',
                        'urchin',
                        'anger'
                    ],
                    inPlay: ['dodger']
                },
                player2: {}
            });

            this.player1.moveCard(this.shadowSelf, 'deck');
            this.player1.moveCard(this.urchin, 'deck');
            this.player1.moveCard(this.gangerChieftain, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.theWarchest, 'deck');
            this.player1.moveCard(this.seekerNeedle, 'deck');
        });

        it('plays creature', function () {
            this.player1.play(this.aberrantWarpEvent);
            // expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            this.player1.clickPrompt('Left');
            expect(this.player1).toHavePrompt('Choose a creaturex');
            expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).not.toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.dodger);
            expect(this.gangerChieftain.location).toBe('play area');
            expect(this.shadowSelf.location).toBe('deck');
            expect(this.seekerNeedle.location).toBe('discard');
            expect(this.theWarchest.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            // this.player1.clickPrompt('Left');
        });
    });
});
