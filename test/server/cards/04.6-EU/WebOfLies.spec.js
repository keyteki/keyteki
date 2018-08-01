describe('Web of Lies', function() {
    integration(function() {
        describe('Web of Lies\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['borderlands-defender']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['maze-of-illusion'],
                        provinces: ['web-of-lies']
                    }
                });
                this.borderlandsDefender = this.player1.findCardByName('borderlands-defender');

                this.webOfLies = this.player2.findCardByName('web-of-lies');

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('3');

                this.noMoreActions();
            });

            it('should have a strength of 6', function() {
                expect(this.game.currentPhase).toBe('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: 'web-of-lies',
                    attackers: [this.borderlandsDefender],
                    defenders: []
                });
                expect(this.webOfLies.getStrength()).toBe(6);
            });

            it('provice should update if the players bid changes', function() {
                expect(this.game.currentPhase).toBe('conflict');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    province: 'web-of-lies',
                    attackers: [this.borderlandsDefender],
                    defenders: []
                });
                expect(this.webOfLies.getStrength()).toBe(6);
                this.player2.clickCard('maze-of-illusion');
                this.player2.clickCard(this.borderlandsDefender);
                this.player2.clickPrompt('1');
                this.player1.clickPrompt('Odd');
                expect(this.webOfLies.getStrength()).toBe(2);
            });
        });
    });
});
