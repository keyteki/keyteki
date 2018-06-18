describe('Vanguard Warrior', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['vanguard-warrior', 'borderlands-defender'],
                    hand: ['reprieve']
                }
            });
            this.spy = spyOn(this.flow.game, 'addMessage');
        });

        describe('when Vanguard Warrior uses his ability', function() {
            it('should sacrifice him and add 1 fate to the target', function() {
                this.vanguardWarrior = this.player1.clickCard('vanguard-warrior');
                expect(this.player1).toHavePrompt('Vanguard Warrior');
                this.player1.clickPrompt('Pay Costs First');
                expect(this.vanguardWarrior.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Vanguard Warrior');
                this.borderlandsDefender = this.player1.clickCard('borderlands-defender');
                expect(this.borderlandsDefender.fate).toBe(1);
            });

            it('should be possible to prevent the sacrifice', function() {
                this.reprieve = this.player1.playAttachment('reprieve', 'vanguard-warrior');
                this.player2.pass();
                this.vanguardWarrior = this.player1.clickCard('vanguard-warrior');
                this.player1.clickPrompt('Pay Costs First');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.reprieve);
            });
        });

        describe('when Vanguard Warrior\'s sacrifice is prevented', function() {
            beforeEach(function() {
                this.reprieve = this.player1.playAttachment('reprieve', 'vanguard-warrior');
                this.player2.pass();
                this.vanguardWarrior = this.player1.clickCard('vanguard-warrior');
                this.player1.clickPrompt('Pay Costs First');
                this.player1.clickCard(this.reprieve);
            });

            it('should not move Vanguard Warrior to the discard', function() {
                expect(this.vanguardWarrior.location).toBe('play area');
            });

            it('should terminate the ability', function() {
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.spy).toHaveBeenCalledWith('{0} attempted to use {1}, but did not successfully pay the required costs', this.player1.player, this.vanguardWarrior);
            });
        });

        describe('when Vanguard Warrior\'s sacrifice is prevented after a target has been chosen', function() {
            beforeEach(function() {
                this.reprieve = this.player1.playAttachment('reprieve', 'vanguard-warrior');
                this.player2.pass();
                this.vanguardWarrior = this.player1.clickCard('vanguard-warrior');
                this.borderlandsDefender = this.player1.clickCard('borderlands-defender');
                this.player1.clickCard(this.reprieve);
            });

            it('should not move Vanguard Warrior to the discard', function() {
                expect(this.vanguardWarrior.location).toBe('play area');
            });

            it('should not give the target a fate', function() {
                expect(this.borderlandsDefender.fate).toBe(0);
            });

            it('should terminate the ability', function() {
                expect(this.player1).toHavePrompt('Waiting for opponent to take an action or pass');
                expect(this.spy).toHaveBeenCalledWith('{0} attempted to use {1}, but did not successfully pay the required costs', this.player1.player, this.vanguardWarrior);
            });
        });
    });
});
