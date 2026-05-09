describe('Sack of Coins', function () {
    describe("Sack of Coins' play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['sack-of-coins'],
                    amber: 2
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('allocates damage equal to the player amber (after bonus) to a single creature', function () {
            this.player1.play(this.sackOfCoins);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(3);
            expect(this.krump.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can split damage across multiple creatures', function () {
            this.player1.play(this.sackOfCoins);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.troll.damage).toBe(1);
            expect(this.krump.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals all allocated damage to a target as a single event so ward absorbs the whole bundle', function () {
            this.troll.ward();
            this.player1.play(this.sackOfCoins);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.warded).toBe(false);
            expect(this.troll.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Sack of Coins with minimal amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['sack-of-coins'],
                    amber: 0
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('only deals damage equal to the player amber (1 from bonus)', function () {
            this.player1.play(this.sackOfCoins);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
