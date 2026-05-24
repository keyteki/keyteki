describe('Mega Mogghunter', function () {
    describe("Mega Mogghunter's Fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mega-mogghunter']
                },
                player2: {
                    inPlay: ['looter-goblin', 'nexus', 'troll']
                }
            });
        });

        it('deals 2 damage to a flank creature only', function () {
            this.player1.fightWith(this.megaMogghunter, this.nexus);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.looterGoblin);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.nexus);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.looterGoblin.damage).toBe(0);
            expect(this.nexus.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
