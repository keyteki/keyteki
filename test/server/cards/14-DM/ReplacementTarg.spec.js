describe('Replacement Targ', function () {
    describe("Replacement Targ's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 3,
                    hand: ['replacement-targ'],
                    inPlay: ['iyxrenu-the-clever', 'urchin']
                },
                player2: {
                    amber: 5,
                    inPlay: ['troll']
                }
            });
        });

        it('returns a non-Soldier neighbor and most powerful friendly captures 2 from opponent', function () {
            this.player1.play(this.replacementTarg);
            // played on right flank by default; only friendly neighbor is urchin
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.iyxrenuTheClever);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('hand');
            // most powerful friendly: must not be enemy
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.iyxrenuTheClever);
            expect(this.iyxrenuTheClever.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
