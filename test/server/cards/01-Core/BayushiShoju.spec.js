describe('Bayushi Shoju', function() {
    integration(function() {
        describe('Bayushi Shoju\'s ability', function() {
            beforeEach(function() {
                this.messageSpy = spyOn(this.game, 'addMessage');
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['bayushi-shoju'],
                        hand: ['fiery-madness']
                    },
                    player2: {
                        honor: 9,
                        inPlay: ['yogo-outcast'],
                        hand: ['noble-sacrifice', 'reprieve', 'watch-commander'],
                        conflictDeck: ['stand-your-ground']
                    }
                });
                this.yogoOutcast = this.player2.findCardByName('yogo-outcast');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-shoju'],
                    defenders: [this.yogoOutcast]
                });
                this.player2.pass();
                this.bayushiShoju = this.player1.clickCard('bayushi-shoju');
                this.bayushiShoju.isDishonored = true;
                this.player1.clickCard(this.yogoOutcast);
            });

            it('shouldn\'t discard the target if its political skill is above 0', function() {
                expect(this.yogoOutcast.getPoliticalSkill()).toBe(2);
                expect(this.yogoOutcast.location).toBe('play area');
            });

            it('should discard the target when its political skill drops to 0', function() {
                this.player2.pass();
                this.player1.playAttachment('fiery-madness', this.yogoOutcast);
                expect(this.yogoOutcast.location).toBe('dynasty discard pile');
            });

            it('should discard a Reprieved target', function() {
                this.reprieve = this.player2.playAttachment('reprieve', this.yogoOutcast);
                this.player1.playAttachment('fiery-madness', this.yogoOutcast);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.reprieve);
                this.player2.clickCard(this.reprieve);
                expect(this.yogoOutcast.location).toBe('dynasty discard pile');
            });

            describe('Fiery Madness and Shoju\'s delayed effect', function() {
                it('should discard the target before Watch Commander fires', function() {
                    this.watchCommander = this.player2.playAttachment('watch-commander', this.yogoOutcast);
                    expect(this.yogoOutcast.getPoliticalSkill()).toBe(3);
                    this.player1.clickCard(this.bayushiShoju);
                    this.player1.clickCard(this.yogoOutcast);
                    this.player2.pass();
                    this.player1.playAttachment('fiery-madness', this.yogoOutcast);
                    expect(this.watchCommander.location).toBe('conflict discard pile');
                    expect(this.player2).not.toBeAbleToSelect(this.watchCommander);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    //console.log(this.messageSpy.calls.allArgs())
                });
            });

            // Needs personal honor to be implemented as a forced interrupt
            xdescribe('Noble Sacrifice on an honored Yogo Outcast:', function() {
                beforeEach(function() {
                    this.yogoOutcast.honor();
                    this.player2.pass();
                });

                it('Yogo Outcast should be discarded by Shoju\'s effect', function() {
                    expect(this.yogoOutcast.getPoliticalSkill()).toBe(3);
                    this.player1.playAttachment('fiery-madness', this.yogoOutcast);
                    expect(this.yogoOutcast.location).toBe('play area');
                    this.player2.clickCard('noble-sacrifice');
                    this.player2.clickPrompt('Pay Costs First');
                    this.player2.clickCard(this.yogoOutcast);
                    expect(this.yogoOutcast.location).toBe('dynasty discard pile');
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                });
            });
        });

        describe('Shoju/Keeper Initiate interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-shoju']
                    },
                    player2: {
                        role: 'keeper-of-void',
                        inPlay: ['keeper-initiate', 'shinjo-outrider'],
                        hand: ['mirumoto-s-fury']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'void',
                    type: 'political',
                    attackers: ['bayushi-shoju'],
                    defenders: ['keeper-initiate']
                });
                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
            });

            it('Shoju\'s delayed effect should disappear when a card leaves play', function() {
                this.player2.pass();
                this.bayushiShoju = this.player1.clickCard('bayushi-shoju');
                this.player1.clickCard(this.keeperInitiate);
                expect(this.keeperInitiate.location).toBe('dynasty discard pile');
                this.player2.clickCard('mirumoto-s-fury');
                this.player2.clickCard(this.bayushiShoju);
                expect(this.bayushiShoju.bowed).toBe(true);
                this.player1.pass();
                this.shinjoOutrider = this.player2.clickCard('shinjo-outrider');
                expect(this.shinjoOutrider.inConflict).toBe(true);
                this.noMoreActions();
                this.player2.clickCard('keeper-of-void');
                expect(this.game.rings.void.claimedBy).toBe(this.player2.player.name);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.keeperInitiate);
                this.player2.clickCard(this.keeperInitiate);
                expect(this.keeperInitiate.location).toBe('play area');
            });
        });
    });
});
