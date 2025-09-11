describe('Blernean Hydra', function () {
    describe("Blernean Hydra's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    hand: ['the-common-cold'],
                    inPlay: ['blernean-hydra']
                },
                player2: {
                    amber: 1,
                    inPlay: ['old-bruno', 'troll', 'flaxia']
                }
            });
        });

        it('has no splash attack when not damaged', function () {
            this.player1.fightWith(this.blerneanHydra, this.troll);
            expect(this.oldBruno.tokens.damage).toBe(undefined);
            expect(this.troll.tokens.damage).toBe(5);
            expect(this.flaxia.tokens.damage).toBe(undefined);
        });

        it('gains splash attack X when having X damage', function () {
            this.player1.play(this.theCommonCold);
            expect(this.blerneanHydra.tokens.damage).toBe(1);
            expect(this.blerneanHydra.getKeywordValue('splash-attack')).toBe(1);
            this.player1.fightWith(this.blerneanHydra, this.troll);
            expect(this.oldBruno.tokens.damage).toBe(2);
            expect(this.troll.tokens.damage).toBe(6);
            expect(this.flaxia.tokens.damage).toBe(2);
        });
    });
});
