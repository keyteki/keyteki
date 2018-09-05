describe('Stealer of Souls', function() {
    integration(function() {
        describe('Stealer of Souls\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'dis',
                        inPlay: ['stealer-of-souls']
                    },
                    player2: {
                        inPlay: ['ember-imp']
                    }
                });
            });

            it('should trigger when a creature is destroyed', function() {
                this.player1.fightWith(this.stealerOfSouls, this.emberImp);
                expect(this.emberImp.location).toBe('purged');
                expect(this.player1.amber).toBe(1);
            });
        });
    });
});
