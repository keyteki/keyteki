describe('Multi-Dimensional Rescue', function () {
    describe("Multi-Dimensional Rescue's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['multi-dimensional-rescue', 'missile-officer-myers'],
                    inPlay: ['medic-ingram'],
                    discard: ['world-tree', 'regrowth', 'bigtwig', 'earthbind', 'cpo-zytar']
                },
                player2: {
                    discard: ['urchin']
                }
            });
        });

        it('should prompt for 1 of each card and return it from the discard pile', function () {
            this.player1.play(this.multiDimensionalRescue);

            expect(this.player1).toBeAbleToSelect(this.regrowth);
            this.player1.clickCard(this.regrowth);

            expect(this.player1).toBeAbleToSelect(this.worldTree);
            this.player1.clickCard(this.worldTree);

            expect(this.player1).toBeAbleToSelect(this.bigtwig);
            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            this.player1.clickCard(this.bigtwig);

            expect(this.player1).toBeAbleToSelect(this.earthbind);
            this.player1.clickCard(this.earthbind);

            expect(this.regrowth.location).toBe('hand');
            expect(this.worldTree.location).toBe('hand');
            expect(this.bigtwig.location).toBe('hand');
            expect(this.earthbind.location).toBe('hand');
            expect(this.cpoZytar.location).toBe('discard');
        });

        it('if there are not 1 of each type, the rest are still prompted', function () {
            this.player1.player.moveCard(this.worldTree, 'hand');

            this.player1.play(this.multiDimensionalRescue);

            expect(this.player1).toBeAbleToSelect(this.regrowth);
            this.player1.clickCard(this.regrowth);

            expect(this.player1).toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.bigtwig);
            this.player1.clickCard(this.bigtwig);

            expect(this.player1).toBeAbleToSelect(this.earthbind);
            this.player1.clickCard(this.earthbind);

            expect(this.regrowth.location).toBe('hand');
            expect(this.worldTree.location).toBe('hand');
            expect(this.bigtwig.location).toBe('hand');
            expect(this.earthbind.location).toBe('hand');
            expect(this.cpoZytar.location).toBe('discard');
        });

        it('allows playing one non-SA card this turn', function () {
            this.player1.play(this.multiDimensionalRescue);
            this.player1.clickCard(this.regrowth);
            this.player1.clickCard(this.worldTree);
            this.player1.clickCard(this.bigtwig);
            this.player1.clickCard(this.earthbind);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');

            expect(this.player1).toBeAbleToPlay(this.regrowth);
            expect(this.player1).toBeAbleToPlay(this.worldTree);
            expect(this.player1).toBeAbleToPlay(this.bigtwig);
            expect(this.player1).toBeAbleToPlay(this.earthbind);

            this.player1.play(this.regrowth);
            this.player1.clickCard(this.cpoZytar);
            expect(this.cpoZytar.location).toBe('hand');
            expect(this.regrowth.location).toBe('discard');

            expect(this.player1).not.toBeAbleToPlay(this.worldTree);
            expect(this.player1).not.toBeAbleToPlay(this.bigtwig);
            expect(this.player1).not.toBeAbleToPlay(this.earthbind);
            expect(this.player1).toBeAbleToPlay(this.cpoZytar);
        });

        it('purges itself', function () {
            this.player1.play(this.multiDimensionalRescue);
            this.player1.clickCard(this.regrowth);
            this.player1.clickCard(this.worldTree);
            this.player1.clickCard(this.bigtwig);
            this.player1.clickCard(this.earthbind);
            expect(this.multiDimensionalRescue.location).toBe('purged');
        });
    });
});
