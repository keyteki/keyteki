describe('Tainted Hero', function() {
    integration(function() {
        describe('Tainted Hero\'s ability', function() {
            describe('when attacking', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['tainted-hero', 'hida-guardian']
                        },
                        player2: {
                            inPlay: ['bayushi-manipulator']
                        }
                    });

                    this.taintedHero = this.player1.findCardByName('tainted-hero');
                    this.hidaGuardian = this.player1.findCardByName('hida-guardian');

                    this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
                });

                it('should not be allowed to be declared as an attacker', function() {

                    // skip pre-conflict action phase
                    this.noMoreActions();

                    // initiate conflict
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.taintedHero, this.hidaGuardian],
                        defenders: [this.bayushiManipulator]
                    });

                    // should allow the player to attack with the hida guardian
                    expect(this.game.currentConflict.attackers).toContain(this.hidaGuardian);
                    expect(this.hidaGuardian.inConflict).toBe(true);

                    // should not allow the player to attack with the tainted hero
                    expect(this.game.currentConflict.attackers).not.toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).not.toBe(true);
                });

                it('should be allowed to be declared as an attacker after sacrificing a friendly character', function() {

                    // pre-conflict actions
                    expect(this.player1).toHavePrompt('Initiate an action');
                    this.player1.clickCard(this.taintedHero);
                    expect(this.player1).toHavePrompt('Select card to sacrifice');
                    this.player1.clickCard(this.hidaGuardian);
                    expect(this.hidaGuardian.location).toBe('dynasty discard pile');
                    expect(this.player2).toHavePrompt('Initiate an action');
                    this.noMoreActions();

                    // initiate conflict
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.taintedHero],
                        defenders: [this.bayushiManipulator]
                    });

                    // should not allow the player to attack with the tainted hero
                    expect(this.game.currentConflict.attackers).toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).toBe(true);
                });
            });

            describe('when defending', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['bayushi-manipulator']
                        },
                        player2: {
                            inPlay: ['tainted-hero', 'hida-guardian']
                        }
                    });

                    this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');

                    this.taintedHero = this.player2.findCardByName('tainted-hero');
                    this.hidaGuardian = this.player2.findCardByName('hida-guardian');
                });

                it('should not be allowed to be declared as an defender', function() {

                    // skip pre-conflict action phase
                    this.noMoreActions();

                    // initiate conflict
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.bayushiManipulator],
                        defenders: [this.taintedHero, this.hidaGuardian]
                    });

                    expect(this.game.currentConflict.attackers).toContain(this.bayushiManipulator);
                    expect(this.bayushiManipulator.inConflict).toBe(true);

                    // should allow the player to defend with the hida guardian
                    expect(this.game.currentConflict.defenders).toContain(this.hidaGuardian);
                    expect(this.hidaGuardian.inConflict).toBe(true);

                    // should not allow the player to defend with the tainted hero
                    expect(this.game.currentConflict.defenders).not.toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).not.toBe(true);
                });

                it('should be allowed to be declared as a defender after sacrificing a friendly character', function() {

                    // pre-conflict actions
                    expect(this.player1).toHavePrompt('Initiate an action');
                    this.player1.pass();

                    expect(this.player2).toHavePrompt('Initiate an action');
                    this.player2.clickCard(this.taintedHero);
                    expect(this.player2).toHavePrompt('Select card to sacrifice');
                    this.player2.clickCard(this.hidaGuardian);
                    expect(this.hidaGuardian.location).toBe('dynasty discard pile');

                    expect(this.player1).toHavePrompt('Initiate an action');
                    this.noMoreActions();

                    // initiate conflict
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.bayushiManipulator],
                        defenders: [this.taintedHero, this.hidaGuardian]
                    });

                    expect(this.game.currentConflict.attackers).toContain(this.bayushiManipulator);
                    expect(this.bayushiManipulator.inConflict).toBe(true);

                    // should allow the player to defend with the tainted hero
                    this.player2.clickCard(this.taintedHero);
                    expect(this.game.currentConflict.defenders).toContain(this.taintedHero);
                    expect(this.taintedHero.inConflict).toBe(true);
                });
            });
        });
    });
});
