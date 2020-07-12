describe('Look what I found', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'untamed',
                hand: ['look-what-i-found'],
                discard: ['world-tree', 'regrowth', 'bigtwig', 'earthbind']
            },
            player2: {
                amber: 1,
                inPlay: ['dodger', 'bad-penny']
            }
        });
    });

    it('should prompt for 1 of each card and return it from the discard pile', function () {
        this.player1.play(this.lookWhatIFound);

        expect(this.player1).toBeAbleToSelect(this.regrowth);
        this.player1.clickCard(this.regrowth);

        expect(this.player1).toBeAbleToSelect(this.worldTree);
        this.player1.clickCard(this.worldTree);

        expect(this.player1).toBeAbleToSelect(this.bigtwig);
        this.player1.clickCard(this.bigtwig);

        expect(this.player1).toBeAbleToSelect(this.earthbind);
        this.player1.clickCard(this.earthbind);

        expect(this.regrowth.location).toBe('hand');
        expect(this.worldTree.location).toBe('hand');
        expect(this.bigtwig.location).toBe('hand');
        expect(this.earthbind.location).toBe('hand');
    });

    it('if there are 1 of each type, the rest are still prompted', function () {
        this.player1.player.moveCard(this.worldTree, 'hand');

        this.player1.play(this.lookWhatIFound);

        expect(this.player1).toBeAbleToSelect(this.regrowth);
        this.player1.clickCard(this.regrowth);

        expect(this.player1).toBeAbleToSelect(this.bigtwig);
        this.player1.clickCard(this.bigtwig);

        expect(this.player1).toBeAbleToSelect(this.earthbind);
        this.player1.clickCard(this.earthbind);

        expect(this.regrowth.location).toBe('hand');
        expect(this.worldTree.location).toBe('hand');
        expect(this.bigtwig.location).toBe('hand');
        expect(this.earthbind.location).toBe('hand');
    });
});
