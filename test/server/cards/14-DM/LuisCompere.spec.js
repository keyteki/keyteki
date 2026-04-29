describe('Luis Compere', function () {
    describe("Luis Compere's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['luis-compere']
                },
                player2: {
                    amber: 5,
                    deck: ['troll', 'krump', 'bumpsy', 'urchin', 'hobnobber', 'lamindra']
                }
            });
        });

        it('steals 2 when opponent draws 2 or more cards during their draw step', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when opponent draws fewer than 2 cards during their draw step', function () {
            // Make P2's hand full so they only need to draw 1 card during draw step
            this.player2.player.hand = this.player2.player.hand.concat(
                this.player2.player.deck.slice(0, 5)
            );
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
