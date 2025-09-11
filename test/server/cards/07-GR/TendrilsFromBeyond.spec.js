describe('Tendrils from Beyond', function () {
    describe("Tendrils from Beyond's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['tendrils-from-beyond', 'crushing-deep'],
                    inPlay: ['kaupe', 'wikolia'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg', 'krump'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('returns one friendly creature when not haunted', function () {
            this.player1.fightWith(this.wikolia, this.batdrone);
            this.player1.play(this.tendrilsFromBeyond);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.kaupe);
            expect(this.player1).toBeAbleToSelect(this.wikolia);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.kaupe);
            expect(this.kaupe.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.kaupe);
            expect(this.wikolia.location).toBe('play area');
        });

        it('returns one enemy creature when opponent is not haunted', function () {
            this.player1.play(this.crushingDeep);
            this.player1.play(this.tendrilsFromBeyond);
            this.player1.clickCard(this.mother);
            expect(this.mother.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.mother);
            expect(this.batdrone.location).toBe('play area');
            expect(this.zorg.location).toBe('play area');
        });

        it('returns friendly creature and neighbors when haunted', function () {
            this.player1.play(this.crushingDeep);
            this.player1.play(this.tendrilsFromBeyond);
            this.player1.clickCard(this.kaupe);
            expect(this.kaupe.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.kaupe);
            expect(this.wikolia.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.wikolia);
        });

        it('returns enemy creature and neighbors when opponent is haunted', function () {
            this.player1.fightWith(this.wikolia, this.batdrone);
            this.player1.play(this.tendrilsFromBeyond);
            this.player1.clickCard(this.zorg);
            expect(this.mother.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.mother);
            expect(this.zorg.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.zorg);
            expect(this.krump.location).toBe('hand');
            expect(this.player2.player.hand).toContain(this.krump);
        });
    });
});
