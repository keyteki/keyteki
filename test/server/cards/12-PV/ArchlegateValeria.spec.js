describe('Archlegate Valeria', function () {
    describe("Archlegate Valeria's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'saurian',
                    hand: ['tribune-pompitus'],
                    inPlay: ['urchin', 'archlegate-valeria', 'orator-hissaro']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'dust-pixie', 'ember-imp']
                }
            });
        });

        it('should exalt an enemy creature for one Saurian neighbor', function () {
            this.player1.fightWith(this.archlegateValeria, this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should exalt an enemy creature for two Saurian neighbors', function () {
            this.player1.moveCard(this.urchin, 'discard');
            this.player1.playCreature(this.tribunePompitus, true);
            this.player1.fightWith(this.archlegateValeria, this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.krump);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
