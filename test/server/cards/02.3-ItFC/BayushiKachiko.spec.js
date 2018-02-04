const AbilityDsl = require('../../../../server/game/abilitydsl.js');

describe('Bayushi Kachiko', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-kachiko']
                },
                player2: {
                    inPlay: ['shrewd-yasuki', 'borderlands-defender']
                }
            });
            this.noMoreActions();
        });

        describe('her ability', function() {
            beforeEach(function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-kachiko'],
                    defenders: ['shrewd-yasuki', 'borderlands-defender']
                });
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('bayushi-kachiko');
            });

            it('should not be able to target a character who cannot be sent home', function() {
                this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');
                expect(this.player1).not.toBeAbleToSelect(this.borderlandsDefender);
            });

            it('should send an defender home', function() {
                this.shrewdYasuki = this.player1.clickCard('shrewd-yasuki', 'any', 'opponent');
                expect(this.shrewdYasuki.inConflict).toBe(false);
                expect(this.game.currentConflict.defenders).not.toContain(this.shrewdYasuki);
            });

            it('should give Kachiko\'s controller the option to bow the target', function() {
                this.shrewdYasuki = this.player1.clickCard('shrewd-yasuki', 'any', 'opponent');
                expect(this.player1).toHavePrompt('Do you want to bow Shrewd Yasuki?');
            });
            
            it('should bow the target if Yes is selected', function() {
                this.shrewdYasuki = this.player1.clickCard('shrewd-yasuki', 'any', 'opponent');
                this.player1.clickPrompt('Yes');
                expect(this.shrewdYasuki.bowed).toBe(true);
            });

            it('should not bow the target if No is selected', function() {
                this.shrewdYasuki = this.player1.clickCard('shrewd-yasuki', 'any', 'opponent');
                this.player1.clickPrompt('No');
                expect(this.shrewdYasuki.bowed).toBe(false);
            });
        });

        describe('if her ability is used and the target is not sent home', function() {
            it('her controller should not be prompted to bow the target', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-kachiko'],
                    defenders: ['shrewd-yasuki', 'borderlands-defender']
                });
                this.shrewdYasuki = this.player2.findCardByName('shrewd-yasuki');
                // Give Yasuki a hypothetical ability which cancels send homes
                this.shrewdYasuki.interrupt({
                    title: 'Cancel Send Home',
                    when: {
                        onSendHome: event => event.card === this.shrewdYasuki
                    },
                    canCancel: true,
                    handler: context => context.cancel()
                });
                this.shrewdYasuki.abilities.reactions[0].registerEvents();
                this.game.registerAbility(this.shrewdYasuki.abilities.reactions[0]);
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('bayushi-kachiko');
                this.player1.clickCard(this.shrewdYasuki);

                expect(this.player2).toHavePrompt('Any interrupts?');
                this.player2.clickCard(this.shrewdYasuki);

                expect(this.shrewdYasuki.inConflict).toBe(true);
                expect(this.game.currentConflict.defenders).toContain(this.shrewdYasuki);
                expect(this.player1).not.toHavePrompt('Do you want to bow Shrewd Yasuki?');
            });
        });

        describe('if her ability is used and the target can be sent home but not bowed', function() {
            it('her controller should not be prompted to bow the target', function() {
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-kachiko'],
                    defenders: ['shrewd-yasuki', 'borderlands-defender']
                });
                this.shrewdYasuki = this.player2.findCardByName('shrewd-yasuki');
                // Give Yasuki a hypothetical ability so it cannot be bowed
                this.shrewdYasuki.persistentEffect({
                    match: this.shrewdYasuki,
                    effect: AbilityDsl.effects.cannotBeBowed()
                });
                this.game.addEffect(this.shrewdYasuki, this.shrewdYasuki.abilities.persistentEffects[0]);
                expect(this.shrewdYasuki.allowGameAction('bow')).toBe(false);

                this.player2.clickPrompt('Pass');
                this.player1.clickCard('bayushi-kachiko');
                this.player1.clickCard(this.shrewdYasuki);

                expect(this.shrewdYasuki.inConflict).toBe(false);
                expect(this.game.currentConflict.defenders).not.toContain(this.shrewdYasuki);
                expect(this.player1).not.toHavePrompt('Do you want to bow Shrewd Yasuki?');
            });
        });
    });
});
