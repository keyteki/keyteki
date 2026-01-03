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
            expect(this.dextre.tokens.damage).toBeUndefined(); // Left flank
            expect(this.botBookton.tokens.damage).toBeUndefined(); // Center
            expect(this.docBookton.tokens.damage).toBeUndefined(); // Right flank
            expect(this.troll.tokens.damage).toBeUndefined(); // Left flank
            expect(this.krump.tokens.damage).toBe(3); // Center
            expect(this.bumpsy.tokens.damage).toBeUndefined(); // Right flank
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
