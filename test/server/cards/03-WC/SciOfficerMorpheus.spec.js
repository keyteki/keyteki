describe('Sci. Officer Morpheus', function() {
    integration(function() {
        describe('Sci. Officer Morpheus\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        inPlay: ['sci-officer-morpheus', 'lamindra', 'redlock'],
                        hand: ['medic-ingram', 'sensor-chief-garcia']
                    },
                    player2: {
                        amber: 11,
                        inPlay: ['mighty-tiger'],
                        hand: ['dextre', 'krump']
                    }
                });
            });

            it('should activate play effect of a creature twice and ask for use iteraction twice', function() {
                this.player1.playCreature(this.medicIngram);
                this.player1.clickCard(this.lamindra);
                this.player1.clickCard(this.redlock);
                expect(this.lamindra.warded).toBe(true);
                expect(this.redlock.warded).toBe(true);
            });

            it('should activate play effect of a creature without user iteraction', function() {
                this.player1.playCreature(this.sensorChiefGarcia);
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                expect(this.player2.amber).toBe(1);
            });
        });
    });
});
