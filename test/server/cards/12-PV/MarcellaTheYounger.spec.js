describe('Marcella, the Younger', function () {
    describe("Marcella, the Younger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    inPlay: ['marcella-the-younger'],
                    hand: ['fandangle', 'hunting-witch']
                },
                player2: {
                    amber: 4,
                    inPlay: ['urchin']
                }
            });
        });

        it('should exalt and draw 2 cards after fight', function () {
            this.player1.fightWith(this.marcellaTheYounger, this.urchin);
            this.player1.clickCard(this.marcellaTheYounger);
            expect(this.marcellaTheYounger.tokens.amber).toBe(1);
            expect(this.player1.hand.length).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should exalt and draw 2 cards after reap', function () {
            this.player1.reap(this.marcellaTheYounger);
            this.player1.clickCard(this.marcellaTheYounger);
            expect(this.marcellaTheYounger.tokens.amber).toBe(1);
            expect(this.player1.hand.length).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not draw cards if exalt is declined', function () {
            this.player1.fightWith(this.marcellaTheYounger, this.urchin);
            this.player1.clickPrompt('Done');
            expect(this.marcellaTheYounger.tokens.amber).toBeUndefined();
            expect(this.player1.hand.length).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
