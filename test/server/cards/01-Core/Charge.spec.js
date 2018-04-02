describe('Charge!', function() {
    integration(function() {
        describe('When playing Charge!', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves'],
                        dynastyDeck: ['shiba-tsukune', 'shiba-peacemaker', 'naive-student', 'shiba-peacemaker'],
                        hand: ['charge', 'charge']
                    }
                });
                this.shibaTsukune = this.player1.placeCardInProvince('shiba-tsukune', 'province 1');
                this.shibaPeacemaker1 = this.player1.placeCardInProvince('shiba-peacemaker', 'province 2');
                this.naiveStudent = this.player1.placeCardInProvince('naive-student', 'province 3');
                this.shibaPeacemaker2 = this.player1.placeCardInProvince('shiba-peacemaker', 'province 4');
            });

            it('should not be playable in a pre-conflict window', function() {
                this.player1.clickCard('charge', 'hand');

                expect(this.player1).toHavePrompt('Initiate an action');
            });

            describe('during a conflict', function() {
                beforeEach(function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: ['adept-of-the-waves'],
                        defenders: []
                    });
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard('charge', 'hand');
                });

                it('should allow selecting a character', function() {
                    expect(this.player1).toHavePrompt('Choose a character');
                    expect(this.player1).toBeAbleToSelect(this.shibaTsukune);
                });

                it('should not allow selecting a character which is unable to participate in the conflict due to a dash', function() {
                    expect(this.player1).not.toBeAbleToSelect(this.naiveStudent);
                });

                it('should not allow selecting a character which is unable to participate in the conflict due to a constant ability', function() {
                    expect(this.player1).not.toBeAbleToSelect(this.shibaPeacemaker1);
                });

                describe('if a legal character is selected', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.shibaTsukune);
                    });

                    it('should move that character into the conflict', function() {
                        expect(this.shibaTsukune.inConflict).toBe(true);
                        expect(this.game.currentConflict.attackers).toContain(this.shibaTsukune);
                    });

                    it('should not allow Charge! to be played when there are no legal targets', function() {
                        this.player2.clickPrompt('Pass');
                        this.player1.clickCard('charge', 'hand');

                        expect(this.player1).not.toHavePrompt('Choose a character');
                        expect(this.game.currentActionWindow).not.toBe(null);
                    });
                });
            });
        });
    });
});
