describe('Dirge of the Deep', function () {
    describe("Dirge of the Deep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['bubbles', 'urchin', 'groke'],
                    hand: ['dirge-of-the-deep']
                },
                player2: {
                    inPlay: ['pelf', 'batdrone', 'skullback-crab'],
                    hand: ['pour-tal', 'poke']
                }
            });
        });

        it('should discard card at beginning of opponent turn and exhaust', function () {
            this.player2.moveCard(this.poke, 'deck bottom');
            this.player2.moveCard(this.pourTal, 'deck bottom');
            this.player1.play(this.dirgeOfTheDeep);
            expect(this.pourTal.location).toBe('discard');
            expect(this.bubbles.exhausted).toBe(true);
            expect(this.skullbackCrab.exhausted).toBe(true);
            expect(this.pelf.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.groke.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing if deck is empty', function () {
            this.player2.player.deck = [];
            this.player1.play(this.dirgeOfTheDeep);
            expect(this.bubbles.exhausted).toBe(false);
            expect(this.skullbackCrab.exhausted).toBe(false);
            expect(this.pelf.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.groke.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
