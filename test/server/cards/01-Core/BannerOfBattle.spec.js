describe('Banner of Battle', function() {
    integration(function() {
        describe('when in play', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['banner-of-battle', 'troll', 'bad-penny']
                    },
                    player2: {
                        inPlay: ['urchin', 'krump']
                    }
                });
            });

            it('should increase the power of friendly brobnar creatures', function() {
                expect(this.troll.power).toBe(9);
            });

            it('should increate the power of friendly non-brobnar creatures', function() {
                expect(this.badPenny.power).toBe(2);
            });

            it('should not increase the power of opponent creatues', function() {
                expect(this.urchin.power).toBe(1);
                expect(this.krump.power).toBe(6);
            });
        });
    });
});
