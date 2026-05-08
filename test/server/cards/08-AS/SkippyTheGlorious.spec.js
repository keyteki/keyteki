describe('Skippy the Glorious', function () {
    describe("Skippy the Glorious's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['skippy-the-glorious', 'pelf', 'gub', 'de-animator'],
                    inPlay: ['wretched-doll']
                },
                player2: {
                    inPlay: ['library-of-babble', 'helper-bot'],
                    discard: ['quixxle-stone']
                }
            });

            this.player1.moveCard(this.gub, 'deck');
            this.player1.moveCard(this.pelf, 'deck');
        });

        it('should archive the top of your deck on play', function () {
            this.player1.play(this.skippyTheGlorious);
            expect(this.pelf.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive the top of your deck on reap', function () {
            this.player1.play(this.skippyTheGlorious);
            this.skippyTheGlorious.ready();
            this.player1.reap(this.skippyTheGlorious);
            expect(this.gub.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should use an enemy artifact and draw a card on scrap', function () {
            this.player1.scrap(this.skippyTheGlorious);
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).not.toBeAbleToSelect(this.wretchedDoll);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing on scrap if no enemy artifacts', function () {
            this.player2.moveCard(this.libraryOfBabble, 'discard');
            this.player1.scrap(this.skippyTheGlorious);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing on scrap if no ready enemy artifacts', function () {
            this.libraryOfBabble.exhaust();
            this.player1.scrap(this.skippyTheGlorious);
            this.player1.clickCard(this.libraryOfBabble);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing on scrap if no usuable enemy artifacts', function () {
            this.player2.moveCard(this.quixxleStone, 'play area');
            this.player2.moveCard(this.libraryOfBabble, 'discard');
            this.player1.scrap(this.skippyTheGlorious);
            this.player1.clickCard(this.quixxleStone);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should draw a card for using a deanimated creature', function () {
            this.player1.play(this.deAnimator);
            this.player1.clickCard(this.helperBot);
            this.player1.scrap(this.skippyTheGlorious);
            this.player1.clickCard(this.helperBot);
            expect(this.helperBot.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
