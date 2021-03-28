describe('Yxilo Bolter', function () {
    describe("Yxilo Bolter's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['yxilo-bolter']
                },
                player2: {
                    inPlay: ['batdrone', 'troll', 'bad-penny']
                }
            });
        });

        it('should purge creatures which are destroyed by its ability', function () {
            this.player1.reap(this.yxiloBolter);
            expect(this.player1).toHavePrompt('Yxilo Bolter');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('purged');
        });

        it('should not purge creatures who are not destroyed', function () {
            this.player1.reap(this.yxiloBolter);
            expect(this.player1).toHavePrompt('Yxilo Bolter');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(2);
        });

        it('should not purge Bad Penny when she goes back to hand', function () {
            this.player1.reap(this.yxiloBolter);
            expect(this.player1).toHavePrompt('Yxilo Bolter');
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.badPenny);
            expect(this.badPenny.location).toBe('hand');
        });
    });
});
