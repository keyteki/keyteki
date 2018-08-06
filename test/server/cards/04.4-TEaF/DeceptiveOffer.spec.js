describe('Deceptive Offer', function() {
    integration(function() {
        describe('Deceptive Offer\'s action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-manipulator'],
                        hand: ['deceptive-offer'],
                        honor: 10
                    },
                    player2: {
                        honor: 10
                    }
                });
                this.noMoreActions();
                this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');
            });

            it('should prompt a character to be chosen', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');

                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should give the opponent an option to select between effects', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');
                this.player1.clickCard(this.bayushiManipulator);

                expect(this.player2).toHavePromptButton('Allow your opponent\'s character to gain military and political skill');
                expect(this.player2).toHavePromptButton('Give your opponent 1 honor');
            });

            it('should give +2/+2 when the option is selected', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');
                this.player1.clickCard(this.bayushiManipulator);
                this.player2.clickPrompt('Allow your opponent\'s character to gain military and political skill');

                expect(this.bayushiManipulator.getMilitarySkill()).toBe(3);
                expect(this.bayushiManipulator.getPoliticalSkill()).toBe(3);
            });

            it('should cause the opponent to lose 1 honor and the player to gain 1 honor', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.bayushiManipulator],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard('deceptive-offer');
                this.player1.clickCard(this.bayushiManipulator);
                this.player2.clickPrompt('Give your opponent 1 honor');

                expect(this.player1.player.honor).toBe(11);
                expect(this.player2.player.honor).toBe(9);
            });

        });
    });
});
