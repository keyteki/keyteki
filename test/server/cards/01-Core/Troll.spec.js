describe('Troll', function () {
    describe("Troll's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should heal 3 damage on reap', function () {
            this.troll.tokens.damage = 5;
            this.player1.reap(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fully heal if damage is 3 or less', function () {
            this.troll.tokens.damage = 2;
            this.player1.reap(this.troll);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should work even with no damage', function () {
            this.player1.reap(this.troll);
            expect(this.troll.damage).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not heal after fight', function () {
            this.troll.tokens.damage = 5;
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.troll.damage).toBe(5);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
