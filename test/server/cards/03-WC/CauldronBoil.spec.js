describe('Cauldron Boil', function () {
    describe("Cauldron Boil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['silvertooth', 'rustgnawer', 'brain-eater'],
                    hand: ['cauldron-boil']
                },
                player2: {
                    inPlay: ['dextre', 'sequis', 'mother']
                }
            });
            this.silvertooth.addToken('damage');
            this.dextre.addToken('damage');
            this.sequis.addToken('damage');
            this.brainEater.addToken('damage', 2);
        });
        it('should deal a damage to each enemy unit for each existing damage they have', function () {
            this.player1.play(this.cauldronBoil);
            expect(this.dextre.tokens.damage).toBe(2);
            expect(this.mother.hasToken('damage')).toBe(false);
            expect(this.sequis.tokens.damage).toBe(1);
            expect(this.brainEater.tokens.damage).toBe(4);
        });
    });
});
