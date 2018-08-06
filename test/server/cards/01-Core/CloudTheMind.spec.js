describe('Cloud The Mind', function () {
    integration(function () {
        describe('Cloud The Mind\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-juro'],
                        hand: ['cloud-the-mind'],
                        dynastyDiscard: ['mantis-tenkinja'],
                        conflictDiscard: ['cloud-the-mind']
                    },
                    player2: {
                        inPlay: ['matsu-berserker'],
                        dynastyDiscard: ['kudaka'],
                        hand: ['infiltrator', 'cloud-the-mind']
                    }
                });
                this.player1.player.showBid = 1;
                this.player2.player.showBid = 5;
                this.moto = this.player1.findCardByName('moto-juro');
                this.mantis = this.player1.findCardByName('mantis-tenkinja', 'dynasty discard pile');
                this.kudaka = this.player2.findCardByName('kudaka', 'dynasty discard pile');
                this.cloudHand = this.player1.findCardByName('cloud-the-mind', 'hand');
                this.cloudDeck = this.player1.findCardByName('cloud-the-mind', 'conflict discard pile');
                this.cloud2 = this.player2.findCardByName('cloud-the-mind', 'hand');
                this.matsu = this.player2.findCardByName('matsu-berserker');
            });

            it('should not be able to be played without a shugenja in play', function () {
                this.player1.clickCard(this.cloudHand);
                this.player1.playAttachment(this.cloudHand, this.matsu);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should be able to be played when the player has a shugenja in play', function () {
                this.player1.player.moveCard(this.mantis, 'play area');
                this.player1.playAttachment(this.cloudHand, this.matsu);
                expect(this.cloudHand.location).toBe('play area');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should blank any abilities in the parent\'s text box', function () {
                this.player2.player.moveCard(this.kudaka, 'play area');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.moto],
                    defenders: []
                });
                this.player2.playAttachment(this.cloud2, this.moto);
                this.player1.clickCard(this.moto);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('when an opponent tries to play the player\'s Cloud The Mind', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.moto],
                        defenders: []
                    });
                    this.player1.player.moveCard(this.cloudDeck, 'conflict deck');
                    this.infiltrator = this.player2.playAttachment('infiltrator', this.moto);
                    this.player1.pass();
                });

                it('should not be able to be played without a shugenja of their own in play', function () {
                    this.player2.clickCard(this.infiltrator);
                    expect(this.player2).toHavePrompt('Choose an action for Cloud the Mind');
                    expect(this.player2).not.toHavePromptButton('Play this card');
                });

                it('should be able to be played when a shugenja of their own is in play', function () {
                    this.player2.player.moveCard(this.kudaka, 'play area');
                    this.game.checkGameState(true);
                    this.player2.clickCard(this.infiltrator);
                    expect(this.player2).toHavePrompt('Choose an action for Cloud the Mind');
                    expect(this.player2).toHavePromptButton('Play this card');
                });
            });
        });
    });
});
