describe('Longfused Mines', function () {
    describe("Longfused Mines's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['longfused-mines', 'dextre', 'bot-bookton', 'doc-bookton']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('should sacrifice itself and deal 3 damage to non-flank enemy creatures', function () {
            this.player1.useAction(this.longfusedMines, true);
            expect(this.longfusedMines.location).toBe('discard');
            expect(this.dextre.damage).toBe(0); // Left flank
            expect(this.botBookton.damage).toBe(0); // Center
            expect(this.docBookton.damage).toBe(0); // Right flank
            expect(this.troll.damage).toBe(0); // Left flank
            expect(this.krump.damage).toBe(3); // Center
            expect(this.bumpsy.damage).toBe(0); // Right flank
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
