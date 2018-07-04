describe('Asahina Takako', function() {
    integration(function() {
        describe('Asahina Takako\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-takako'],
                        dynastyDeck: ['doji-challenger', 'doji-whisperer']
                    }
                });
                this.dojiChallenger = this.player1.placeCardInProvince('doji-challenger', 'province 1');
                this.dojiChallenger.facedown = true;
                this.dojiWhisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 2');
            });

            it('should allow facedown cards to be seen', function() {
                this.game.checkGameState(true);
                expect(this.dojiChallenger.hideWhenFacedown()).toBe(false);
            });

            it('should allow a card to be discarded', function() {
                this.player1.clickCard('asahina-takako');
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Select an action:');
                this.player1.clickPrompt('Discard');
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should allow switching two dynasty cards', function() {
                this.player1.clickCard('asahina-takako');
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.player1).toHavePrompt('Select an action:');
                this.player1.clickPrompt('Switch with another card');
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.dojiChallenger.location).toBe('province 2');
                expect(this.dojiWhisperer.location).toBe('province 1');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });
    });
});
