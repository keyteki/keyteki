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
            this.player1.reap(this.championAnaphiel);
        });

        it('should not prompt if no neighbors', function () {
            this.player1.moveCard(this.championAnaphiel, 'discard');
            this.player1.moveCard(this.niffleApe, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.endTurn();
        });

        it('should prompt for target if it only has left neighbor', function () {
            this.player1.moveCard(this.championAnaphiel, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.clickCard(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.toad);
            expect(this.toad.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.niffleApe.damage).toBe(1);
            this.player1.endTurn();
        });

        it('should prompt for target if it only has right neighbor', function () {
            this.player1.moveCard(this.niffleApe, 'discard');
            this.player1.moveCard(this.ardentHero, 'discard');
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.gub);
            expect(this.toad.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.championAnaphiel.damage).toBe(5);
            this.player1.endTurn();
        });

        it('should ready and fight with each neighbor one at a time, starting from left', function () {
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
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.niffleApe.damage).toBe(1);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.niffleApe.damage).toBe(1);
            expect(this.championAnaphiel.armorUsed).toBe(1);
            this.player1.endTurn();
        });

        it('should ready and fight with each neighbor one at a time, starting from right', function () {
            this.player1.fightWith(this.badgemagus, this.lamindra);
            this.player1.clickCard(this.badgemagus);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.ardentHero);
            this.player1.clickCard(this.championAnaphiel);
            expect(this.player1).not.toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.gub);
            expect(this.toad.location).toBe('play area');
            expect(this.gub.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.murkens.location).toBe('play area');
            expect(this.championAnaphiel.damage).toBe(5);
            expect(this.player1).toBeAbleToSelect(this.toad);
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.lamindra);
            expect(this.niffleApe.damage).toBe(1);
            expect(this.championAnaphiel.damage).toBe(5);
            expect(this.lamindra.location).toBe('discard');
            this.player1.endTurn();
        });
    });
});
