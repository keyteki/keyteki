describe('Master Tashi', function () {
    describe("Master Tashi's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['blypyp', 'master-tashi', 'troll', 'krump'],
                    hand: ['revered-monk']
                },
                player2: {
                    inPlay: ['dust-pixie']
                }
            });
        });

        it('should ready and reap with a neighboring creature after fighting', function () {
            this.player1.fightWith(this.masterTashi, this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should ready and fight with a neighboring creature after reaping', function () {
            this.player1.reap(this.masterTashi);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
