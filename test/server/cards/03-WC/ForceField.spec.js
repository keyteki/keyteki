describe('Force Field', function() {
    integration(function() {
        describe('Force Field\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['explo-rover'],
                        hand: ['force-field']
                    },
                    player2: {
                        inPlay: ['lamindra']
                    }
                });
            });

            it('Check reap will ward the creature', function() {
                expect(this.exploRover.warded).toBe(false);
                this.player1.playUpgrade(this.forceField, this.exploRover);
                expect(this.player1.amber).toBe(1);
                this.player1.reap(this.exploRover);
                expect(this.player1.amber).toBe(2);
                expect(this.exploRover.warded).toBe(true);
            });

            it('Check fight will not ward the creature', function() {
                expect(this.exploRover.warded).toBe(false);
                this.player1.playUpgrade(this.forceField, this.exploRover);
                this.player1.fightWith(this.exploRover, this.lamindra);
                expect(this.exploRover.warded).toBe(false);
            });
        });
    });
});
