describe('Shadow Gloomcoil', function () {
    describe("Shadow Gloomcoil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['shadow-gloomcoil', 'caspart']
                },
                player2: {
                    inPlay: ['troll', 'pelf']
                }
            });
        });

        it('deals 1 to each friendly creature after a friendly creature is used', function () {
            this.player1.reap(this.caspart);
            expect(this.shadowGloomcoil.damage).toBe(1);
            expect(this.caspart.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not deal damage when it dies in the fight that triggers the reaction', function () {
            this.player1.fightWith(this.shadowGloomcoil, this.troll);
            expect(this.shadowGloomcoil.location).toBe('discard');
            expect(this.caspart.damage).toBe(0);
            expect(this.troll.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals damage when it dies from ability damage', function () {
            this.player1.fightWith(this.shadowGloomcoil, this.pelf);
            expect(this.shadowGloomcoil.location).toBe('discard');
            expect(this.caspart.damage).toBe(1);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals damage when a creature dies in the fight that triggers the reaction', function () {
            this.player1.fightWith(this.caspart, this.troll);
            expect(this.caspart.location).toBe('discard');
            expect(this.shadowGloomcoil.damage).toBe(1);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
