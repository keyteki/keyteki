describe('Blackmail', function() {
    integration(function() {
        describe('When playing Blackmail', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        faction: 'scorpion',
                        honor: 10,
                        inPlay: ['seppun-guardsman'],
                        hand: ['blackmail']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['miya-mystic', 'shiba-peacemaker', 'radiant-orator', 'otomo-courtier'],
                        hand: ['watch-commander', 'honored-blade']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['seppun-guardsman'],
                    defenders: ['miya-mystic', 'shiba-peacemaker', 'radiant-orator']
                });
                this.miyaMystic = this.player2.findCardByName('miya-mystic');
                this.shibaPeacemaker = this.player2.findCardByName('shiba-peacemaker');
                this.radiantOrator = this.player2.findCardByName('radiant-orator');
                this.otomoCourtier = this.player2.findCardByName('otomo-courtier');
            });

            it('should only be legal if the player has less honor than their opponent', function() {
                this.player1.player.honor = 11;
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('blackmail');

                expect(this.player1).not.toHavePrompt('Choose a character');
                expect(this.game.currentActionWindow).not.toBe(null);
            });

            it('should allow characters with cost under 3 in the conflict to be chosen', function() {
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('blackmail');
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).toBeAbleToSelect(this.shibaPeacemaker);
            });

            it('should allow characters outside the conflict with cost under 3 to be chosen', function() {
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('blackmail');
                expect(this.player1).toBeAbleToSelect(this.otomoCourtier);
            });

            it('should not allow characters with cost 3 or higher to be chosen', function() {
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('blackmail');
                expect(this.player1).not.toBeAbleToSelect(this.radiantOrator);
            });

            describe('if a character who can participate as an attacker and who is in the conflict is chosen', function() {
                beforeEach(function() {
                    this.spy = spyOn(this.game, 'addMessage');
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard('blackmail');
                    this.player1.clickCard(this.miyaMystic);
                });

                it('should move that character from a defender to an attacker', function() {
                    expect(this.miyaMystic.controller).toBe(this.player1.player);
                    expect(this.game.currentConflict.attackers).toContain(this.miyaMystic);
                    expect(this.game.currentConflict.defenders).not.toContain(this.miyaMystic);
                });

                it('should correctly calculate the new conflict totals', function() {
                    expect(this.game.currentConflict.attackerSkill).toBe(3);
                    expect(this.game.currentConflict.defenderSkill).toBe(5);
                });

                it('should return the character to previous controller at the end of the conflict', function() {
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Initiate an action');
                    expect(this.miyaMystic.controller).toBe(this.player2.player);
                    expect(this.spy).not.toHaveBeenCalledWith('{0} cannot participate in the conflict any more and is sent home bowed', this.miyaMystic);
                });
            });

            describe('if a character who cannot participate as an attacker and who is in the conflict is chosen', function() {
                beforeEach(function() {
                    this.spy = spyOn(this.game, 'addMessage');
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard('blackmail');
                    this.player1.clickCard(this.shibaPeacemaker);
                });


                it('should send the character to the blackmailing players home, bowed', function() {
                    expect(this.shibaPeacemaker.inConflict).toBe(false);
                    expect(this.shibaPeacemaker.bowed).toBe(true);
                    expect(this.game.currentConflict.attackers).not.toContain(this.shibaPeacemaker);
                    expect(this.game.currentConflict.defenders).not.toContain(this.shibaPeacemaker);
                    expect(this.shibaPeacemaker.controller).toBe(this.player1.player);                    
                });

                it('should display a game message indicating why the character has been sent home', function() {
                    expect(this.spy).toHaveBeenCalledWith('{0} cannot participate in the conflict any more and is sent home bowed', this.shibaPeacemaker);
                });
                
                it('should correctly calculate the new conflict totals', function() {
                    expect(this.game.currentConflict.attackerSkill).toBe(2);
                    expect(this.game.currentConflict.defenderSkill).toBe(2);
                });

                it('should return the character to previous controller at the end of the conflict', function() {
                    this.player2.playAttachment('watch-commander', this.miyaMystic);
                    expect(this.game.currentConflict.defenderSkill).toBe(3);

                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Initiate an action');
                    expect(this.miyaMystic.controller).toBe(this.player2.player);
                });
            });
        });

        describe('A character with an action ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['soshi-illusionist'],
                        hand: ['blackmail']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['doji-gift-giver', 'doji-whisperer']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['soshi-illusionist'],
                    defenders: ['doji-gift-giver', 'doji-whisperer']
                });
                this.dojiGiftGiver = this.player2.clickCard('doji-gift-giver');
                this.soshiIllusionist = this.player1.clickCard('soshi-illusionist');
                this.player1.clickCard('blackmail');
                this.player1.clickCard(this.dojiGiftGiver);
                this.player2.clickPrompt('Pass');
            });

            it('should be usable after blackmailing, even if it were used by its previous controller', function() {
                expect(this.soshiIllusionist.bowed).toBe(true);
                this.player1.clickCard(this.dojiGiftGiver);
                expect(this.player2).toHavePrompt('Choose a character');
            });
        });

        describe('A character with a constant abilitiy', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 11,
                        inPlay: ['yogo-outcast']
                    },
                    player2: {
                        honor: 10,
                        hand: ['blackmail']
                    }
                });
                this.yogoOutcast = this.player1.findCardByName('yogo-outcast');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['yogo-outcast'],
                    defenders: []
                });
                this.player2.clickCard('blackmail');
                this.player2.clickCard(this.yogoOutcast);
            });

            it('should only have one instance of the constant ability in effect', function() {
                expect(this.yogoOutcast.getPoliticalSkill()).toBe(3);
            });
        });    
    });
});
