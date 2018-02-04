describe('Shrewd Yasuki', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 11,
                    inPlay: ['shrewd-yasuki'],
                    dynastyDeck: ['imperial-storehouse']
                },
                player2: {
                    honor: 10,
                    hand: ['blackmail'],
                    inPlay: ['bayushi-liar'],
                    dynastyDeck: ['favorable-ground']
                }
            });
            this.imperialStorehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
            this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: ['shrewd-yasuki'],
                defenders: []
            });
        });

        describe('after the conflict', function() {
            it('shouldn\'t be a legal action', function() {
                this.noMoreActions();
                this.player1.clickPrompt('No');
                this.player1.clickCard('shrewd-yasuki');
                expect(this.player1).toHavePrompt('Initiate an action');
            });            
        });

        describe('when neither player has a holding in play', function() {
            it('shouldn\'t be a legal action', function() {
                this.player2.clickCard(this.favorableGround);
                this.bayushiLiar = this.player2.clickCard('bayushi-liar');
                expect(this.bayushiLiar.inConflict).toBe(true);
                this.player1.clickCard(this.imperialStorehouse);
                this.player2.clickPrompt('Pass');
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('shrewd-yasuki');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('when Shrewd Yasuki\'s controller has a holding in play', function() {
            it('should be a legal action', function() {
                this.player2.clickCard(this.favorableGround);
                this.bayushiLiar = this.player2.clickCard('bayushi-liar');
                expect(this.bayushiLiar.inConflict).toBe(true);
                this.player1.clickCard('shrewd-yasuki');
                expect(this.player1).toHavePrompt('Shrewd Yasuki');
            });
        });

        describe('when the other player has a holding in play', function() {
            it('should be a legal action', function() {
                this.player2.clickPrompt('Pass');
                this.player1.clickCard(this.imperialStorehouse);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('shrewd-yasuki');
                expect(this.player1).toHavePrompt('Shrewd Yasuki');
            });
        });

        describe('when both players have a holding in play', function() {
            it('should be a legal action', function() {
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('shrewd-yasuki');
                expect(this.player1).toHavePrompt('Shrewd Yasuki');
            });
        });
    });
});
