describe('Infiltrator', function() {
    integration(function() {
        describe('Infiltrator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker'],
                        conflictDiscard: [
                            'assassination', 'honored-blade', 'master-of-the-spear', 'ready-for-battle', 'captive-audience'
                        ]
                    },
                    player2: {
                        honor: 10,
                        fate: 4,
                        hand: ['infiltrator']
                    }
                });
                this.player1.player.showBid = 1;
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.assassination = this.player1.findCardByName('assassination');
                this.honoredBlade = this.player1.findCardByName('honored-blade');
                this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
                this.readyForBattle = this.player1.findCardByName('ready-for-battle');
                this.captiveAudience = this.player1.findCardByName('captive-audience');
                this.player2.player.showBid = 5;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
            });

            it('should not be playable when both player\'s honor dials are equal', function() {
                this.player1.player.showBid = 5;
                this.player2.clickCard('infiltrator');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt the player to discard or play the top card', function() {
                this.infiltrator = this.player2.playAttachment('infiltrator', this.matsuBerserker);
                this.player1.pass();
                this.player1.player.moveCard(this.assassination, 'conflict deck');
                this.player2.clickCard(this.infiltrator);
                expect(this.player2).toHavePrompt('Infiltrator');
                expect(this.player2).toHavePrompt('Choose an action for Assassination');
                expect(this.player2.currentButtons).toContain('Discard this card');
                expect(this.player2.currentButtons).toContain('Play this card');
            });

            it('should allow the player to play an event from the deck', function() {
                this.infiltrator = this.player2.playAttachment('infiltrator', this.matsuBerserker);
                this.player1.pass();
                this.player1.player.moveCard(this.assassination, 'conflict deck');
                this.player2.clickCard(this.infiltrator);
                this.player2.clickPrompt('Play this card');
                expect(this.player2).toHavePrompt('Assassination');
                this.player2.clickCard(this.matsuBerserker);
                expect(this.matsuBerserker.location).toBe('dynasty discard pile');
                expect(this.player2.honor).toBe(7);
                expect(this.assassination.location).toBe('conflict discard pile');
                expect(this.player1.player.conflictDiscardPile.toArray()).toContain(this.assassination);
            });

            it('should allow the player to play an attachment from the deck', function() {
                this.infiltrator = this.player2.playAttachment('infiltrator', this.matsuBerserker);
                this.player1.pass();
                this.player1.player.moveCard(this.honoredBlade, 'conflict deck');
                this.player2.clickCard(this.infiltrator);
                this.player2.clickPrompt('Play this card');
                expect(this.player2).toHavePrompt('Honored Blade');
                this.player2.clickCard(this.matsuBerserker);
                expect(this.honoredBlade.location).toBe('play area');
                expect(this.matsuBerserker.attachments.toArray()).toContain(this.honoredBlade);
                expect(this.player2.fate).toBe(2);
            });

            it('should allow the player to play a character from the deck', function() {
                this.infiltrator = this.player2.playAttachment('infiltrator', this.matsuBerserker);
                this.player1.pass();
                this.player1.player.moveCard(this.masterOfTheSpear, 'conflict deck');
                this.player2.clickCard(this.infiltrator);
                this.player2.clickPrompt('Play this card');
                expect(this.player2).toHavePrompt('Master of the Spear');
                expect(this.player2.currentButtons).toContain('0');
                expect(this.player2.currentButtons).not.toContain('1');
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('Conflict');
                expect(this.masterOfTheSpear.location).toBe('play area');
                expect(this.masterOfTheSpear.inConflict).toBe(true);
                expect(this.masterOfTheSpear.controller).toBe(this.player2.player);
                expect(this.player2.fate).toBe(0);
            });
        });
    });
});
