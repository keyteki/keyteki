describe('Steadfast Witch Hunter', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['against-the-waves']
                },
                player2: {
                    inPlay: ['steadfast-witch-hunter'],
                    dynastyDeck: ['borderlands-defender']
                }
            });
            this.spy = spyOn(this.flow.game, 'addMessage');
            this.steadfastWitchHunter = this.player2.findCardByName('steadfast-witch-hunter');
        });

        describe('Steadfast Witch Hunter\'s ability', function() {
            it('should be illegal when there are no legal targets', function() {
                this.player1.pass();
                expect(this.steadfastWitchHunter.allowGameAction('ready')).toBe(false);
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.player2).toHavePrompt('Action Window');
            });

            it('should display a message if the only legal target is sacrificed', function() {
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.steadfastWitchHunter);
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.player2).toHavePrompt('Steadfast Witch Hunter');
                this.player2.clickPrompt('Pay Costs First');
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.steadfastWitchHunter.location).toBe('dynasty discard pile');
                expect(this.spy).toHaveBeenCalledWith('{0} attempted to use {1}, but there are insufficient legal targets', this.player2.player, this.steadfastWitchHunter);
            });

            it('should still display a message if the target is chosen then sacrificed', function() {
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.steadfastWitchHunter);
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.player2).toHavePrompt('Steadfast Witch Hunter');
                this.player2.clickCard(this.steadfastWitchHunter);
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.steadfastWitchHunter.location).toBe('dynasty discard pile');
                expect(this.spy).toHaveBeenCalledWith('{0} attempted to use {1}, but there are insufficient legal targets', this.player2.player, this.steadfastWitchHunter);
            });

            it('should prompt the player to select a new target if the first target is no longer in play', function() {
                this.borderlandsDefender = this.player2.putIntoPlay('borderlands-defender');
                this.borderlandsDefender.bowed = true;
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.steadfastWitchHunter);
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.player2).toHavePrompt('Steadfast Witch Hunter');
                this.player2.clickCard(this.steadfastWitchHunter);
                this.player2.clickCard(this.steadfastWitchHunter);
                expect(this.steadfastWitchHunter.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Steadfast Witch Hunter');
                this.player2.clickCard(this.borderlandsDefender);
                expect(this.borderlandsDefender.bowed).toBe(false);
                //expect(this.spy).toHaveBeenCalledWith('{0} uses {1} and sacrifices {2} to ready {3}', this.player2.player, this.steadfastWitchHunter, this.steadfastWitchHunter, this.borderlandsDefender);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
