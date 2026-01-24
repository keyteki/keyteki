describe('Screaming Cave', function () {
    describe("Screaming Cave's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['screaming-cave'],
                    hand: ['urchin', 'dust-pixie'],
                    discard: ['niffle-ape', 'way-of-the-bear']
                },
                player2: {}
            });
        });

        it('should shuffle hand and discard pile into deck', function () {
            let deckSize = this.player1.deck.length;
            this.player1.useAction(this.screamingCave);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1.discard.length).toBe(0);
            expect(this.player1.deck.length).toBe(deckSize + 4);
            expect(this.urchin.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.niffleApe.location).toBe('deck');
            expect(this.wayOfTheBear.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
