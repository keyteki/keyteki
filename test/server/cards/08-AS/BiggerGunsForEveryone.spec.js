describe('Bigger Guns For Everyone', function () {
    describe("Bigger Guns For Everyone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['bigger-guns-for-everyone'],
                    inPlay: ['troll', 'rowdy-skald']
                },
                player2: {
                    inPlay: ['hunting-witch', 'krump']
                }
            });

            this.player1.playUpgrade(this.biggerGunsForEveryone, this.troll);
        });

        it('should allow fighting creature to do 5 damage to an enemy creatue', function () {
            this.player1.fightWith(this.troll, this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.rowdySkald);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow fighting creature to do 5 damage to a friendly creatue', function () {
            this.player1.fightWith(this.troll, this.huntingWitch);
            this.player1.clickCard(this.rowdySkald);
            expect(this.rowdySkald.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
