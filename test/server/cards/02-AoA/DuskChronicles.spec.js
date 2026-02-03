describe('Dusk Chronicles', function () {
    describe("Dusk Chronicles's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 3,
                    hand: ['dusk-chronicles', 'urchin', 'dodger']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should draw a card if opponent has more amber', function () {
            let handSize = this.player1.hand.length;
            this.player1.play(this.duskChronicles);
            expect(this.player1.hand.length).toBe(handSize);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive a card if player has more amber', function () {
            this.player2.amber = 3;
            this.player1.play(this.duskChronicles);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('archives');
            expect(this.dodger.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing if amber is equal', function () {
            this.player2.amber = 4;
            let handSize = this.player1.hand.length;
            this.player1.play(this.duskChronicles);
            expect(this.player1.hand.length).toBe(handSize - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
