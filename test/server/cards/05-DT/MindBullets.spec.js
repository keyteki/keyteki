describe('Mind Bullets', function () {
    describe("'Mind Bullets' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['ancient-bear', 'zorg'],
                    hand: ['opposition-research', 'archimedes', 'dextre', 'mind-bullets']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should deal 1D to each creature for each card played this turn', function () {
            this.player1.play(this.dextre);
            this.player1.play(this.oppositionResearch);
            this.player1.play(this.archimedes);
            this.player1.play(this.mindBullets);
            expect(this.ancientBear.tokens.damage).toBe(4);
            expect(this.zorg.tokens.damage).toBe(4);
            expect(this.troll.tokens.damage).toBe(4);
        });
    });
});
