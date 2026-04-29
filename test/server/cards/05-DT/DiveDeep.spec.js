describe('Dive Deep', function () {
    describe("Dive Deep's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['dive-deep'],
                    inPlay: ['flaxia', 'groke']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump'],
                    discard: ['troll', 'groggins']
                }
            });
            this.player2.moveCard(this.troll, 'deck');
        });

        it('should discard from opponent deck and only allow selecting same house creatures', function () {
            this.player1.play(this.diveDeep);

            expect(this.troll.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
        });

        it('should put selected opponent creature on top of their deck', function () {
            this.player1.play(this.diveDeep);
            this.player1.clickCard(this.krump);

            expect(this.krump.location).toBe('deck');
            expect(this.groke.location).toBe('play area');
            expect(this.diveDeep.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should put selected friendly creature on top of their deck', function () {
            this.player1.play(this.diveDeep);
            this.player1.clickCard(this.groke);

            expect(this.groke.location).toBe('deck');
            expect(this.krump.location).toBe('play area');
            expect(this.diveDeep.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fizzle when no matching creatures in play', function () {
            this.player1.moveCard(this.groke, 'discard');
            this.player2.moveCard(this.krump, 'discard');
            this.player1.play(this.diveDeep);

            expect(this.troll.location).toBe('discard');
            expect(this.diveDeep.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fizzle when opponent deck is empty', function () {
            this.player2.player.deck = [];
            this.player1.play(this.diveDeep);

            expect(this.groke.location).toBe('play area');
            expect(this.krump.location).toBe('play area');
            expect(this.diveDeep.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
