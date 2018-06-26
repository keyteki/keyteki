describe('Maze of Illusion', function() {
    integration(function() {
        describe('Maze of Illusion\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['matsu-berserker', 'kitsu-spiritcaller']
                    },
                    player2: {
                        hand: ['maze-of-illusion']
                    }
                });
                this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.matsuBerserker],
                    defenders: []
                });
                this.player2.clickCard('maze-of-illusion');
            });

            it('should not allow targeting characters not participating', function() {
                this.kitsuSpiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
                expect(this.player2).toHavePrompt('Maze of Illusion');
                expect(this.player2).toBeAbleToSelect(this.matsuBerserker);
                expect(this.player2).not.toBeAbleToSelect(this.kitsuSpiritcaller);
            });

            it('should prompt the player to choose a new dial value', function() {
                this.player2.clickCard(this.matsuBerserker);
                expect(this.player2).toHavePrompt('Choose a value to set your honor dial at');
            });

            it('should prompt their opponent to choose Even or Odd', function() {
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('5');
                expect(this.player1).toHavePrompt('Guess whether your opponent set their dial to even or odd');
            });

            it('should display messages saying what players choices were', function() {
                this.chatSpy = spyOn(this.game, 'addMessage');
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('5');
                this.player1.clickPrompt('Even');
                expect(this.chatSpy).toHaveBeenCalledWith('{0} guesses {1}', this.player1.player, 'Even');
                expect(this.chatSpy).toHaveBeenCalledWith('{0} reveals their honor dial:{1}', this.player2.player, 5);
            });

            it('should change the players honor dial', function() {
                this.chatSpy = spyOn(this.game, 'addMessage');
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('5');
                this.player1.clickPrompt('Even');
                expect(this.player2.player.showBid).toBe(5);
            });

            it('should bow and dishonor the target if the opponent guesses Even and they are wrong', function() {
                this.chatSpy = spyOn(this.game, 'addMessage');
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('5');
                this.player1.clickPrompt('Even');
                expect(this.matsuBerserker.isDishonored).toBe(true);
                expect(this.matsuBerserker.bowed).toBe(true);
            });

            it('should bow and dishonor the target if the opponent guesses Odd and they are wrong', function() {
                this.chatSpy = spyOn(this.game, 'addMessage');
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('4');
                this.player1.clickPrompt('Odd');
                expect(this.matsuBerserker.isDishonored).toBe(true);
                expect(this.matsuBerserker.bowed).toBe(true);
            });

            it('should not bow or dishonor the target if the opponent guesses Even and they are right', function() {
                this.chatSpy = spyOn(this.game, 'addMessage');
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('4');
                this.player1.clickPrompt('Even');
                expect(this.matsuBerserker.isDishonored).toBe(false);
                expect(this.matsuBerserker.bowed).toBe(false);
            });

            it('should not bow or dishonor the target if the opponent guesses Odd and they are right', function() {
                this.chatSpy = spyOn(this.game, 'addMessage');
                this.player2.clickCard(this.matsuBerserker);
                this.player2.clickPrompt('5');
                this.player1.clickPrompt('Odd');
                expect(this.matsuBerserker.isDishonored).toBe(false);
                expect(this.matsuBerserker.bowed).toBe(false);
            });
        });
    });
});
