describe('Take That, Smartypants!', function () {
    describe("Take That, Smartypants!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['take-that-smartypants']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'doc-bookton', 'dextre']
                }
            });
        });

        it('should not steal when opponent has fewer than 3 Logos cards', function () {
            this.player2.moveCard(this.dextre, 'discard');
            this.player1.play(this.takeThatSmartypants);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 2A when opponent has 3 or more Logos cards', function () {
            this.player1.play(this.takeThatSmartypants);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
