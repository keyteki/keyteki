describe("Ortannu's Binding", function () {
    describe("Ortannu's Binding's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['ortannu-s-binding'],
                    inPlay: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('deals 2 damage to a chosen friendly creature', function () {
            this.player1.play(this.ortannuSBinding);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.lamindra.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
