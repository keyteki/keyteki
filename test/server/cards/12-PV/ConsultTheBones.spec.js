describe('Consult the Bones', function () {
    describe("Consult the Bones's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['consult-the-bones'],
                    discard: ['troll'],
                    inPlay: ['krump']
                },
                player2: {
                    amber: 2,
                    discard: ['ember-imp']
                }
            });

            this.emberImp.enhancements = ['capture'];
            this.troll.enhancements = ['amber'];
        });

        it('should discard the top card of each deck and resolve their bonus icons', function () {
            this.player1.moveCard(this.troll, 'deck');
            this.player2.moveCard(this.emberImp, 'deck');
            this.player1.play(this.consultTheBones);
            expect(this.troll.location).toBe('discard');
            expect(this.emberImp.location).toBe('discard');
            this.player1.clickCard(this.krump);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.krump.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not resolve bonus icons if no cards are discarded', function () {
            this.player1.player.deck = [];
            this.player2.player.deck = [];
            this.player1.play(this.consultTheBones);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
