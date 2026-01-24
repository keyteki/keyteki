describe('Timetraveller', function () {
    describe("Timetraveller's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['timetraveller']
                }
            });
        });

        it('should draw 2 cards when played', function () {
            const handSize = this.player1.hand.length;
            this.player1.play(this.timetraveller);
            expect(this.player1.hand.length).toBe(handSize + 1); // Play Timetraveller, draw 2
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Timetraveller's action ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['timetraveller']
                }
            });
        });

        it('should shuffle itself into deck', function () {
            const deckSize = this.player1.deck.length;
            this.player1.useAction(this.timetraveller);
            expect(this.timetraveller.location).toBe('deck');
            expect(this.player1.deck.length).toBe(deckSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
