describe('Mega Cowfyne', function () {
    describe("Mega Cowfyne's Before Fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mega-cowfyne']
                },
                player2: {
                    inPlay: ['troll', 'nexus', 'dodger']
                }
            });
        });

        it('deals 2 damage to each neighbor of the creature being fought', function () {
            this.player1.fightWith(this.megaCowfyne, this.nexus);
            expect(this.troll.damage).toBe(2);
            expect(this.dodger.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals damage only to existing neighbors when fighting a flank creature', function () {
            this.player1.fightWith(this.megaCowfyne, this.troll);
            expect(this.nexus.damage).toBe(2);
            expect(this.dodger.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
