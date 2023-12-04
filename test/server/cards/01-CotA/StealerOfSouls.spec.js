describe('Stealer of Souls', function () {
    describe("Stealer of Souls's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['stealer-of-souls']
                },
                player2: {
                    inPlay: ['ember-imp', 'bad-penny']
                }
            });
        });

        it('should trigger when a creature is destroyed', function () {
            this.player1.fightWith(this.stealerOfSouls, this.emberImp);
            expect(this.emberImp.location).toBe('purged');
            expect(this.player1.amber).toBe(1);
        });

        it('should not purge bad penny, but should gain 1 amber', function () {
            this.player1.fightWith(this.stealerOfSouls, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.player1.amber).toBe(1);
        });
    });
});
