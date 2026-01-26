describe('Yxilo Bolter', function () {
    describe("Yxilo Bolter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['yxilo-bolter']
                },
                player2: {
                    inPlay: ['batdrone', 'troll', 'bad-penny', 'lamindra', 'shadow-self']
                }
            });
        });

        it('should purge creatures which are destroyed by its ability', function () {
            this.player1.reap(this.yxiloBolter);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.shadowSelf);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('purged');
        });

        it('should not purge creatures who are not destroyed', function () {
            this.player1.reap(this.yxiloBolter);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(2);
        });

        it('should not purge creatures who are destroyed, but were not the target', function () {
            this.shadowSelf.damage = 7;
            this.player1.reap(this.yxiloBolter);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.damage).toBe(0);
            expect(this.lamindra.location).toBe('play area');
            expect(this.shadowSelf.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should not purge Bad Penny when she goes back to hand', function () {
            this.player1.reap(this.yxiloBolter);
            this.player1.clickCard(this.badPenny);
            expect(this.badPenny.location).toBe('hand');
        });

        it('should not purge warded creatures', function () {
            this.badPenny.ward();
            this.player1.reap(this.yxiloBolter);
            this.player1.clickCard(this.badPenny);
            expect(this.badPenny.warded).toBe(false);
            expect(this.badPenny.location).toBe('play area');
        });
    });
});
