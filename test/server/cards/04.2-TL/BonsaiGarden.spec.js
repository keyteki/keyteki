describe('Bonsai Garden', function() {
    integration(function() {
        describe('Bonsai Garden\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDeck: ['bonsai-garden'],
                        inPlay: ['moto-horde']
                    },
                    player2: {
                        inPlay: []
                    }
                });
                this.bonsaiGarden = this.player1.placeCardInProvince('bonsai-garden', 'province 1');
                this.noMoreActions();
            });

            it('should trigger during an Air conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: ['moto-horde'],
                    defenders: []
                });
                this.player2.pass();
                let honor = this.player1.honor;
                this.player1.clickCard('bonsai-garden');
                expect(this.player1.honor).toBe(honor + 1);
            });

            it('should not trigger during non-Air conflicts', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'earth',
                    attackers: ['moto-horde'],
                    defenders: []
                });
                this.player2.pass();
                let honor = this.player1.honor;
                this.player1.clickCard('bonsai-garden');
                expect(this.player1.honor).toBe(honor);
            });
        });
    });
});
