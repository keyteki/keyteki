describe('Niffle Brute', function () {
    describe("Niffle Brute's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'niffle-brute',
                    inPlay: ['niffle-brute:toad'],
                    discard: ['dust-pixie', 'niffle-ape', 'niffle-queen', 'niffle-sanctuary']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });

            this.niffleBrute1 = this.player1.player.creaturesInPlay[0];
        });

        it('should return the sanctuary to hand on destroy', function () {
            this.player1.fightWith(this.niffleBrute1, this.troll);
            expect(this.player1).toBeAbleToSelect(this.niffleSanctuary);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.niffleApe);
            expect(this.player1).not.toBeAbleToSelect(this.niffleQueen);
            expect(this.player1).not.toBeAbleToSelect(this.niffleBrute1);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.niffleSanctuary);
            expect(this.niffleSanctuary.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return a Niffle card to hand if no sanctuary', function () {
            this.player1.moveCard(this.niffleSanctuary, 'play area');
            this.player1.fightWith(this.niffleBrute1, this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.niffleSanctuary);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.niffleApe);
            expect(this.player1).toBeAbleToSelect(this.niffleQueen);
            expect(this.player1).not.toBeAbleToSelect(this.niffleBrute1);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
