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
                    discard: ['ancient-bear'],
                    hand: ['odoac-the-patrician']
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
            this.expectReadyToTakeAction(this.player1);
        });

        it('should always steal and draw until player has more amber', function () {
            this.player2.amber = 11;
            let deckSize = this.player2.deck.length;
            this.player1.play(this.closedDoorNegotiation);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(6);
            expect(this.player2.deck.length).toBe(deckSize - 5);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should stop after one draw if stealing is not allowed', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('saurian');
            this.player2.playCreature(this.odoacThePatrician);
            this.player2.endTurn();
            this.player2.amber = 11;
            this.player1.clickPrompt('ekwidon');
            this.player2.moveCard(this.ancientBear, 'deck');
            let deckSize = this.player2.deck.length;
            this.player1.play(this.closedDoorNegotiation);
            expect(this.player1.amber).toBe(1); // 1 captured on odoac
            expect(this.player2.amber).toBe(11);
            expect(this.ancientBear.location).toBe('hand');
            expect(this.player2.deck.length).toBe(deckSize - 1);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
