describe('Reverse Time', function () {
    describe("Reverse Time's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['reverse-time', 'mother'],
                    discard: ['dextre']
                },
                player2: {}
            });
        });

        it('should swap deck and discard pile', function () {
            this.player1.moveCard(this.mother, 'deck');
            let deckSize = this.player1.deck.length;
            let discardSize = this.player1.discard.length;
            this.player1.play(this.reverseTime);
            expect(this.player1.deck.length).toBe(discardSize);
            expect(this.player1.discard.length).toBe(deckSize + 1);
            expect(this.player1.deck).toContain(this.dextre);
            expect(this.player1.discard).toContain(this.mother);
            expect(this.player1.discard).toContain(this.reverseTime);
            expect(this.player1.discard[this.player1.discard.length - 1]).toBe(this.mother);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
