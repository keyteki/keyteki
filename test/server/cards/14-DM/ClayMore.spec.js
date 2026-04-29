describe('Clay More', function () {
    describe("Clay More's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['clay-more', 'urchin', 'silvertooth']
                },
                player2: {
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
        });

        it('deals 2 damage to each enemy flank creature when destroyed and does not damage friendly creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.clayMore);
            expect(this.clayMore.location).toBe('discard');
            expect(this.troll.damage).toBe(3);
            expect(this.bumpsy.damage).toBe(2);
            expect(this.krump.damage).toBe(0);
            expect(this.urchin.damage).toBe(0);
            expect(this.silvertooth.damage).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
