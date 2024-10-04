describe('Skippy the Glorious', function () {
    describe("Skippy the Glorious's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['skippy-the-glorious', 'pelf', 'gub'],
                    inPlay: ['wretched-doll']
                },
                player2: {
                    inPlay: ['library-of-babble'],
                    discard: ['quixxle-stone']
                }
            });

            this.player1.moveCard(this.gub, 'deck');
            this.player1.moveCard(this.pelf, 'deck');
        });

        it('should archive the top of your deck on play', function () {
            this.player1.play(this.skippyTheGlorious);
            expect(this.pelf.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should archive the top of your deck on reap', function () {
            this.player1.play(this.skippyTheGlorious);
            this.skippyTheGlorious.exhausted = false;
            this.player1.reap(this.skippyTheGlorious);
            expect(this.gub.location).toBe('archives');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should use an enemy artifact and draw a card on scrap', function () {
            this.player1.scrap(this.skippyTheGlorious);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.wretchedDoll);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing on scrap if no enemy artifacts', function () {
            this.player2.moveCard(this.libraryOfBabble, 'discard');
            this.player1.scrap(this.skippyTheGlorious);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing on scrap if no ready enemy artifacts', function () {
            this.libraryOfBabble.exhausted = true;
            this.player1.scrap(this.skippyTheGlorious);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should do nothing on scrap if no usuable enemy artifacts', function () {
            this.player2.moveCard(this.quixxleStone, 'play area');
            this.player2.moveCard(this.libraryOfBabble, 'discard');
            this.player1.scrap(this.skippyTheGlorious);
            this.player1.clickCard(this.quixxleStone);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
