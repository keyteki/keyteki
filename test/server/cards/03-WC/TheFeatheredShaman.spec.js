describe('The Feathered Shaman', function() {
    integration(function() {
        describe('The Feathered Shaman\'s fight and reap abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['dextre', 'the-feathered-shaman', 'flaxia']
                    },
                    player2: {
                        house: 'shadows',
                        inPlay: ['lamindra']
                    }
                });
            });

            it('Reap should ward neighbors', function() {

                expect(this.player1.amber).toBe(0);

                expect(this.theFeatheredShaman.warded).toBe(false);
                expect(this.flaxia.warded).toBe(false);
                expect(this.dextre.warded).toBe(false);

                this.player1.reap(this.theFeatheredShaman);

                expect(this.player1.amber).toBe(1);

                expect(this.theFeatheredShaman.warded).toBe(false);
                expect(this.flaxia.warded).toBe(true);
                expect(this.dextre.warded).toBe(true);
            });

            it('Fight should ward neighbors', function() {

                expect(this.theFeatheredShaman.warded).toBe(false);
                expect(this.flaxia.warded).toBe(false);
                expect(this.dextre.warded).toBe(false);

                this.player1.fightWith(this.theFeatheredShaman, this.lamindra);

                expect(this.theFeatheredShaman.warded).toBe(false);
                expect(this.flaxia.warded).toBe(true);
                expect(this.dextre.warded).toBe(true);
            });

        });
    });
});
