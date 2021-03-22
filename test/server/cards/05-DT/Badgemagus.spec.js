describe('Badgemagus', function () {
    describe("Badgemagus's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 1,
                    inPlay: ['niffle-ape', 'badgemagus', 'champion-anaphiel', 'ardent-hero']
                },
                player2: {
                    amber: 4,
                    inPlay: ['toad', 'gub', 'murkens', 'lamindra']
                }
            });

            this.gub.tokens.damage = 3;
        });

        it('should fight with each neighbor one at a time', function () {
            this.player1.fightWith(this.badgemagus, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.toad);
            expect(this.toad.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.niffleApe.tokens.damage).toBe(1);
            expect(this.championAnaphiel.armorUsed).toBe(1);
        });
    });
});
