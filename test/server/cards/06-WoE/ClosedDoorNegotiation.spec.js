describe('Closed-Door Negotiation', function () {
    describe("Closed-Door Negotiation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['closed-door-negotiation']
                },
                player2: {
                    amber: 1,
                    discard: ['ancient-bear', 'flaxia', 'dust-pixie', 'bumpsy', 'silvertooth']
                }
            });
        });

        it('should always steal 1 and let opponent draw 1 card', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            let deckSize = this.player2.deck.length;
            this.player1.play(this.closedDoorNegotiation);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.ancientBear.location).toBe('hand');
            expect(this.player2.deck.length).toBe(deckSize - 1);
        });

        it('should always steal and draw until player has more amber', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player2.moveCard(this.flaxia, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');
            this.player2.moveCard(this.bumpsy, 'deck');
            this.player2.moveCard(this.silvertooth, 'deck');
            this.player2.amber = 11;
            let deckSize = this.player2.deck.length;
            this.player1.play(this.closedDoorNegotiation);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(6);
            expect(this.ancientBear.location).toBe('hand');
            expect(this.flaxia.location).toBe('hand');
            expect(this.dustPixie.location).toBe('hand');
            expect(this.bumpsy.location).toBe('hand');
            expect(this.silvertooth.location).toBe('hand');
            expect(this.player2.deck.length).toBe(deckSize - 5);
        });
    });
});
