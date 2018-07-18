describe('Nezumi Infiltrator', function() {
    integration(function() {
        describe('Nezumi Infiltrator\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['third-tower-guard'],
                        hand: ['nezumi-infiltrator','ride-them-down'],
                        provinces: ['defend-the-wall']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                    }
                });

                this.ttg = this.player1.findCardByName('third-tower-guard');
                this.nezumi = this.player1.findCardByName('nezumi-infiltrator');
                this.rtd = this.player1.findCardByName('ride-them-down');
                this.dtw = this.player1.findCardByName('defend-the-wall');

                this.bd = this.player2.findCardByName('borderlands-defender');
                this.sd = this.player2.findCardByName('shameful-display');
            });

            it('should not trigger when entering play before a conflict', function() {
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                expect(this.nezumi.location).toBe('play area');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
            });

            it('should trigger when entering play at home during a conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['third-tower-guard'],
                    defenders: ['borderlands-defender'],
                });
                this.player2.pass();
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Home');
                expect(this.nezumi.location).toBe('play area');
                expect(this.player1).toBeAbleToSelect(this.nezumi);
            });

            it('should trigger when entering play in the conflict', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['third-tower-guard'],
                    defenders: ['borderlands-defender'],
                });
                this.player2.pass();
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.nezumi.location).toBe('play area');
                expect(this.player1).toBeAbleToSelect(this.nezumi);
            });

            it('should correctly lower attacked province\'s strength', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['third-tower-guard'],
                    defenders: ['borderlands-defender'],
                });
                this.player2.pass();
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.player1.clickCard(this.nezumi);
                expect(this.player1).toHavePromptButton('Lower Attacked Province\'s strength');
                expect(this.player1).toHavePromptButton('Raise Attacked Province\'s strength');
                this.player1.clickPrompt('Lower Attacked Province\'s strength');
                expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(2);
            });

            it('should correctly raise attacked province\'s strength', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['third-tower-guard'],
                    defenders: ['borderlands-defender'],
                });
                this.player2.pass();
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.player1.clickCard(this.nezumi);
                expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');
                expect(this.player1).toHavePromptButton('Raise attacked province\'s strength by 1');
                this.player1.clickPrompt('Raise attacked province\'s strength by 1');
                expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(4);
            });

            it('should not modify attacked province\'s strength if its strength is 1', function() {
                this.player1.player.imperialFavor = 'political';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['third-tower-guard'],
                    defenders: ['borderlands-defender'],
                });
                this.player2.pass();
                this.player1.clickCard(this.rtd);
                this.player2.pass();
                expect(this.sd.getStrength()).toBe(1);
                this.player1.clickCard(this.nezumi);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                this.player1.clickCard(this.nezumi);
                expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 1');
                expect(this.player1).toHavePromptButton('Raise attacked province\'s strength by 1');
                this.player1.clickPrompt('Lower attacked province\'s strength by 1');
                expect(this.game.currentConflict.conflictProvince.getStrength()).toBe(1);
            });
        });
    });
});
