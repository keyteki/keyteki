describe('Ashwing Protocol', function () {
    describe("Ashwing Protocol's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['ashwing-protocol'],
                    deck: ['caspart', 'sparkscheme', 'noxious-ionox', 'snapper-dyn']
                },
                player2: {
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('draws 3 when overwhelmed', function () {
            expect(this.player1.player.isOverwhelmed()).toBe(true);
            const handBefore = this.player1.hand.length;
            this.player1.play(this.ashwingProtocol);
            expect(this.player1.hand.length).toBe(handBefore + 3 - 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not draw when not overwhelmed', function () {
            this.player2.moveCard(this.troll, 'discard');
            this.player2.moveCard(this.bumpsy, 'discard');
            const handBefore = this.player1.hand.length;
            this.player1.play(this.ashwingProtocol);
            expect(this.player1.hand.length).toBe(handBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
