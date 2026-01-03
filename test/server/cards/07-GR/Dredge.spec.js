describe('Dredge', function () {
    describe("Dredge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['dredge'],
                    inPlay: ['bubbles', 'skullback-crab'],
                    discard: ['flaxia', 'full-moon', 'hunting-witch']
                },
                player2: {
                    discard: ['pour-tal', 'poke']
                }
            });
        });

        it('gives friendly creatures a reap ability to put a card from discard on top of the deck', function () {
            this.player1.play(this.dredge);
            this.player1.reap(this.bubbles);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.fullMoon);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.dredge);
            expect(this.player1).not.toBeAbleToSelect(this.bubbles);
            expect(this.player1).not.toBeAbleToSelect(this.skullbackCrab);
            expect(this.player1).not.toBeAbleToSelect(this.pourTal);
            expect(this.player1).not.toBeAbleToSelect(this.poke);
            this.player1.clickCard(this.flaxia);
            this.expectReadyToTakeAction(this.player1);
            expect(this.flaxia.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.flaxia);
            this.player1.reap(this.skullbackCrab);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.fullMoon);
            this.expectReadyToTakeAction(this.player1);
            expect(this.fullMoon.location).toBe('deck');
            expect(this.player1.player.deck[0]).toBe(this.fullMoon);
            expect(this.player1.player.deck[1]).toBe(this.flaxia);
        });

        it('does nothing with no discard', function () {
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.play(this.dredge);
            this.player1.reap(this.bubbles);
            this.player1.clickCard(this.dredge);
            this.player1.reap(this.skullbackCrab);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
