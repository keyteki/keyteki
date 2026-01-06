describe('Drag to Your Doom', function () {
    describe("Drag to Your Doom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: ['drag-to-your-doom'],
                    inPlay: ['dodger']
                },
                player2: {
                    inPlay: ['troll', 'lamindra', 'batdrone']
                }
            });
        });

        it('puts an enemy flank creature on the bottom of its owner deck', function () {
            this.player1.play(this.dragToYourDoom);
            expect(this.player1).toHavePrompt('Drag to Your Doom');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('deck');
            expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
