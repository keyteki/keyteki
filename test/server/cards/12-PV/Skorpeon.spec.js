describe('Skorpeon', function () {
    describe("Skorpeon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['searine'],
                    inPlay: ['skorpeon', 'ember-imp', 'krump']
                },
                player2: {
                    inPlay: ['troll', 'mighty-tiger']
                }
            });
        });

        it('should deal 2 damage for one Dis neighbor when reaping', function () {
            this.player1.reap(this.skorpeon);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.mightyTiger);
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            expect(this.player1).not.toBeAbleToSelect(this.skorpeon);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 2 damage for two Dis neighbors when reaping', function () {
            this.player1.playCreature(this.searine, true);
            this.player1.reap(this.skorpeon);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.mightyTiger);
            expect(this.troll.tokens.damage).toBe(2);
            expect(this.mightyTiger.tokens.damage).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal no damage for no Dis neighbors when reaping', function () {
            this.player1.fightWith(this.emberImp, this.troll);
            this.player1.reap(this.skorpeon);
            expect(this.troll.tokens.damage).toBe(2); // fight
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
