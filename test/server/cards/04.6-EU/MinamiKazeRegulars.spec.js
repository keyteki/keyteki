describe('Minami Kaze Regulars', function() {
    integration(function() {
        describe('Minami Kaze Regulars\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['minami-kaze-regulars'],
                        hand:[]
                    },
                    player2: {
                        inPlay: ['borderlands-defender', 'steadfast-witch-hunter']
                    }
                });

                this.minamiKazeRegulars = this.player1.findCardByName('minami-kaze-regulars');

                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                this.steadfastWitchHunter = this.player2.findCardByName('steadfast-witch-hunter');

                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');

                this.noMoreActions();
            });

            it('should trigger after winning a conflict where controller has more participants than the opponent', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.minamiKazeRegulars],
                    defenders: [],
                    province: this.shamefulDisplay
                });
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.minamiKazeRegulars);
                expect(this.player1.hand.length).toBe(1);
                expect(this.player1.fate).toBe(4);
                expect(this.player1).toHavePrompt('Break Shameful Display');
                this.player1.clickPrompt('Yes');
            });

            it('should not trigger after winning a conflict where controller has less or equal participants than the opponent', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.minamiKazeRegulars],
                    defenders: [this.steadfastWitchHunter]
                });
                this.noMoreActions();
                expect(this.player1.hand.length).toBe(0);
                expect(this.player1.fate).toBe(3);
            });

            it('should not trigger after losing a conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.minamiKazeRegulars],
                    defenders: [this.borderlandsDefender, this.steadfastWitchHunter]
                });
                this.noMoreActions();
                expect(this.game.currentConflict).toBeNull();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.player1.hand.length).toBe(0);
                expect(this.player1.fate).toBe(3);
            });
        });
    });
});
