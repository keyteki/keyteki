describe('conflict phase', function() {
    integration(function() {
        // check pre-conflict action window works properly: character, attachment, events are all playable and priority passes correctly
        describe('during the pre-conflict action window', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['Adept of the Waves'],
                        hand: ['Fine Katana', 'against-the-waves'],
                        dynastyDeck: ['Imperial Storehouse']
                    },
                    player2: {
                        hand: ['stoic-gunso']
                    }
                });
            });

            it('should begin by prompting first player', function() {
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should allow attachments to be played', function() {
                this.player1.clickCard('Fine Katana');
                expect(this.player1).toHavePrompt('Choose a card');
            });

            it('should pass priority correctly on a pass', function() {
                this.player1.clickPrompt('Pass');
                expect(this.player2).toHavePrompt('Initiate an action');
            });

            it('should allow characters to be played', function() {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('stoic-gunso');
                expect(this.player2).toHavePrompt('Choose additional fate');
            });

            it('should allow character abilities to be used', function() {
                this.player1.clickCard('adept-of-the-waves');
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should allow holding abilities to be used', function() {
                this.imperialStorehouse = this.player1.placeCardInProvince('imperial-storehouse', 'province 1');
                this.player1.clickCard(this.imperialStorehouse);
                expect(this.player1.player.hand.size()).toBe(3);
            });

            it('should allow events to be played', function() {
                this.player1.clickCard('against-the-waves');
                expect(this.player1).toHavePrompt('Choose a character');
            });

            it('should allow a player to pass and then play again', function() {
                this.player1.clickCard('fine-katana');
                this.player1.clickCard('adept-of-the-waves');
                this.player2.clickPrompt('Pass');
                this.player1.clickCard('adept-of-the-waves');
                this.player1.clickCard('adept-of-the-waves');

                expect(this.player2).toHavePrompt('Initiate an action');
            });

            it('should prompt the first player to declare a conflict after both players pass', function() {
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');

                expect(this.player1).toHavePrompt('Choose an elemental ring\n(click the ring again to change conflict type)');
            });
        });
        // check conflict declaration on first conflict, provinces/rings are correctly selectable, only legal attackers can be selected
        describe('When a players is prompted to declare a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['Fine Katana', 'tattooed-wanderer'],
                        dynastyDeck: ['Imperial Storehouse', 'sinister-soshi', 'doomed-shugenja']
                    },
                    player2: {
                        provinces: ['night-raid']
                    }
                });
                this.sinisterSoshi = this.player1.placeCardInProvince('sinister-soshi', 'province 1');
                this.doomedShugenja = this.player1.placeCardInProvince('doomed-shugenja', 'province 2');
            });

            it('should skip initiating a conflict when the first player has no units in play', function() {
                this.spy = spyOn(this.game, 'addMessage');
                this.noMoreActions();

                expect(this.spy).toHaveBeenCalledWith('{0} passes their conflict opportunity as none of their characters can be declared as an attacker', this.player1.player);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should skip initiating a conflict when the first player has no units which can attack', function() {
                this.spy = spyOn(this.game, 'addMessage');
                this.player1.putIntoPlay(this.sinisterSoshi);
                this.noMoreActions();

                expect(this.spy).toHaveBeenCalledWith('{0} passes their conflict opportunity as none of their characters can be declared as an attacker', this.player1.player);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            it('should skip initiating a conflict when the first players units are bowed, even if their attachments are not', function() {
                this.spy = spyOn(this.game, 'addMessage');
                let tattooedWanderer = this.player1.playCharacterFromHand('tattooed-wanderer');
                this.player2.clickPrompt('Pass');
                this.player1.playAttachment('fine-katana', tattooedWanderer);
                tattooedWanderer.bowed = true;
                this.noMoreActions();

                expect(this.spy).toHaveBeenCalledWith('{0} passes their conflict opportunity as none of their characters can be declared as an attacker', this.player1.player);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            describe('when first player has an unbowed attacker who is able to be declared', function() {
                beforeEach(function() {
                    this.nightRaid = this.player2.findCardByName('night-raid');
                    this.tattooedWanderer = this.player1.playCharacterFromHand('tattooed-wanderer');
                    this.noMoreActions();
                });

                it('should prompt the first player to initiate a conflict', function() {
                    expect(this.player1).toHavePrompt('Choose an elemental ring\n(click the ring again to change conflict type)');
                });
    
                it('should select a ring when clicked', function() {
                    this.player1.clickRing('air');
                    expect(this.player1).toHavePrompt('Choose province to attack');
                    expect(this.game.currentConflict.conflictRing).toBe('air');
                });
    
                it('should select a province when clicked', function() {
                    this.player1.clickCard(this.nightRaid);
                    expect(this.game.currentConflict.conflictProvince).toBe(this.nightRaid);
                    expect(this.nightRaid.inConflict).toBe(true);
                });
    
                it('should select an attacker when clicked', function() {
                    this.player1.clickCard(this.tattooedWanderer);
                    expect(this.game.currentConflict.attackers).toContain(this.tattooedWanderer);
                    expect(this.tattooedWanderer.inConflict).toBe(true);
                });
    
                it('should not allow illegal attackers to be selected', function() {
                    this.player1.putIntoPlay(this.sinisterSoshi);
                    this.player1.putIntoPlay(this.doomedShugenja);
                    this.doomedShugenja.bowed = true;
                    this.player1.clickRing('air');

                    this.player1.clickCard(this.sinisterSoshi);
                    expect(this.sinisterSoshi.inConflict).toBe(false);
                    expect(this.game.currentConflict.attackers).not.toContain(this.sinisterSoshi);
    
                    this.player1.clickCard(this.doomedShugenja);
                    expect(this.doomedShugenja.inConflict).toBe(false);
                    expect(this.game.currentConflict.attackers).not.toContain(this.doomedShugenja);
                });
            });
        });
        // check reacting to conflict declaration works correctly
        describe('reactions to declaring a conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['child-of-the-plains'],
                        hand: ['spyglass']
                    },
                    player2: {
                        provinces: ['elemental-fury', 'secret-cache'],
                        inPlay: ['tattooed-wanderer'],
                        hand: ['mantra-of-fire']
                    }
                });
                this.childOfThePlains = this.player1.findCardByName('child-of-the-plains');
                this.spyglass = this.player1.playAttachment('spyglass', this.childOfThePlains);
                this.elementalFury = this.player2.findCardByName('elemental-fury');
                this.noMoreActions('Initiate an action');
            });

            it('should reveal the province', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    province: 'elemental-fury',
                    attackers: [this.childOfThePlains]
                });
                expect(this.elementalFury.facedown).toBe(false);
            });

            it('should give first player the first opportunitiy to react', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    province: 'elemental-fury',
                    attackers: [this.childOfThePlains]
                });
                
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                expect(this.player1).toBeAbleToSelect(this.childOfThePlains);
            });

            it('should pass priority to the second player when the first player takes an action', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    province: 'elemental-fury',
                    attackers: [this.childOfThePlains]
                });
                this.player1.clickCard(this.spyglass);
                
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('mantra-of-fire');
                expect(this.player2).toBeAbleToSelect('elemental-fury');
            });

            it('should pass priority to the second player when the first player passes', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    province: 'elemental-fury',
                    attackers: [this.childOfThePlains]
                });
                this.player1.clickPrompt('Pass');
                
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('mantra-of-fire');
                expect(this.player2).toBeAbleToSelect('elemental-fury');
            });

            it('should pass priority back to first player if first player passes then second player reacts', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    province: 'elemental-fury',
                    attackers: [this.childOfThePlains]
                });
                this.player1.clickPrompt('Pass');
                this.player2.clickCard(this.elementalFury);
                this.player2.clickRing('water');
                
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.spyglass);
                expect(this.player1).toBeAbleToSelect(this.childOfThePlains);
            });

            it('should close the window if both players pass without reacting', function() {
                this.initiateConflict({
                    ring: 'fire',
                    type: 'military',
                    province: 'elemental-fury',
                    attackers: [this.childOfThePlains]
                });
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                
                expect(this.player2).toHavePrompt('Choose defenders');
            });
        });
        
        // check covert works and is correctly cancellable
        // check defender declaration works and stops illegal defenders from being selected
        // check conflict action window works properly, and messages are correctly displayed
        // check pride is properly triggered and can be interrupted and reacted to
        // check combat reactions work correctly for both players
        // check unopposed is correctly done
        // check province breaks are correctly determined
        // check province breaks can be reacted to
        // check ring effects resolve correctly, and allow choice
        // check claiming the ring works, and can be reacted to

        describe('3.2.7 Claiming the ring', function() {
            describe('If Kaede is attacking, and the defending player wins with Keeper of Void and an Initiate in discard', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['isawa-kaede']
                        },
                        player2: {
                            role: 'keeper-of-void',
                            inPlay: ['otomo-courtier'],
                            dynastyDeck: ['keeper-initiate'],
                            hand: ['mirumoto-s-fury']
                        }
                    });
                    this.player2.placeCardInProvince('keeper-initiate', 'province 1');
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        ring: 'air',
                        attackers: ['isawa-kaede'],
                        defenders: ['otomo-courtier']
                    });
                    this.player2.clickCard('mirumoto-s-fury');
                    this.isawaKaede = this.player2.clickCard('isawa-kaede', 'any', 'opponent');
                });

                it('the ring should have the void element', function() {
                    expect(this.game.currentConflict.hasElement('void')).toBe(true);
                });

                it('Kaede should be bowed', function() {
                    expect(this.isawaKaede.bowed).toBe(true);
                });

                it('the defending player should be able to trigger Keeper of Void', function() {
                    this.noMoreActions();
                    this.keeperOfVoid = this.player2.findCardByName('keeper-of-void');
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.keeperOfVoid);

                });

                describe('if the defending player wins', function() {
                    beforeEach(function() {
                        this.noMoreActions();
                        this.player2.clickCard('keeper-of-void');
                    });

                    it('player2 should have won the conflict', function() {
                        expect(this.game.currentConflict.winner).toBe(this.player2.player);
                    });

                    it('the defending player should claim the ring', function() {
                        expect(this.game.rings['air'].claimedBy).toBe('player2');
                    });

                    it('the ring should still be contested', function() {
                        expect(this.game.rings['air'].contested).toBe(true);
                    });

                    it('the ring should have the void element', function() {
                        expect(this.game.currentConflict.hasElement('void')).toBe(true);
                    });

                    it('the defending player should have the opportunity to trigger Keeper Initiate', function() {
                        expect(this.player2).toHavePrompt('Triggered Abilities');

                        this.keeperInitiate = this.player2.clickCard('keeper-initiate');
                        expect(this.keeperInitiate.location).toBe('play area');
                        expect(this.player1).toHavePrompt('Initiate an action');
                    });
                });
            });

            describe('If Hotaru is attacking with a Seeker of Knowledge', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['doji-hotaru', 'seeker-of-knowledge']
                        }
                    });
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        ring: 'fire',
                        attackers: ['doji-hotaru', 'seeker-of-knowledge'],
                        defenders: [],
                        jumpTo: 'resolveRing'
                    });
                    this.dojiHotaru = this.player1.findCardByName('doji-hotaru');
                    //this.spy = spyOn(this.game.currentConflict, 'chooseElementsToResolve');
                    this.player1.clickPrompt('Yes');
                });

                it('should prompt the player to choose an element to resolve', function() {
                    //expect(this.spy).toHaveBeenCalledWith(this.player1.player, ['air', 'fire'], true);
                    expect(this.player1).toHavePrompt('Choose a ring effect to resolve');
                });

                it('should allow the player to choose air', function() {
                    this.player1.clickRing('air');
                    expect(this.player1).toHavePrompt('Choose an effect to resolve');
                });

                describe('When the ring is claimed', function() {
                    beforeEach(function() {
                        this.player1.clickRing('air');
                        this.player1.clickPrompt('Gain 2 Honor');    
                    });
                
                    it('should be claimed by player1', function() {
                        expect(this.game.rings['fire'].claimedBy).toBe('player1');
                    });

                    it('should still be contested', function() {
                        expect(this.game.rings['fire'].contested).toBe(true);
                    });

                    it('should allow the player to trigger Hotaru', function() {
                        expect(this.player1).toHavePrompt('Triggered Abilities');
                        expect(this.player1).toBeAbleToSelect(this.dojiHotaru);
                    });

                    it('should allow the player to resolve the air ring effect again', function() {
                        this.player1.clickCard(this.dojiHotaru);
                        expect(this.player1).toHavePrompt('Choose a ring effect to resolve');

                        this.player1.clickRing('air');
                        expect(this.player1).toHavePrompt('Choose an effect to resolve');
                    });
                });
            });
        });
        
        // check return home and reactions to it work correctly
        describe('3.2.8 Return Home', function() {
            describe('When participants return home', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['doji-whisperer', 'doji-challenger'],
                            hand: ['curry-favor']
                        },
                        player2: {
                            inPlay: ['intimidating-hida'],
                            hand: ['the-mountain-does-not-fall']
                        }
                    });
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'water',
                        attackers: ['doji-challenger'],
                        defenders: ['intimidating-hida']
                    });
                    this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                    this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                    this.intimidatingHida = this.player2.findCardByName('intimidating-hida');
                });

                it('they should all be bowed', function() {
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Initiate an action');
                    expect(this.dojiChallenger.bowed).toBe(true);
                    expect(this.intimidatingHida.bowed).toBe(true);
                });

                describe('if a participant doesn\'t bow due to returning home', function() {
                    it('it should remain ready', function() {
                        this.player2.clickCard('the-mountain-does-not-fall');
                        this.player2.clickCard(this.intimidatingHida);
                        this.noMoreActions();
                        expect(this.player1).toHavePrompt('Initiate an action');
                        expect(this.dojiChallenger.bowed).toBe(true);
                        expect(this.intimidatingHida.bowed).toBe(false);    
                    });
                });

                it('reactions should trigger correctly', function() {
                    this.noMoreActions();
                    this.noMoreActions();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: ['doji-whisperer'],
                        defenders: []
                    });
                    this.noMoreActions();
                    this.player1.clickPrompt('No');
                    this.player1.clickPrompt('Gain 2 honor');
                    expect(this.dojiWhisperer.bowed).toBe(true);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect('curry-favor');
                    this.player1.clickCard('curry-favor');
                    expect(this.dojiWhisperer.bowed).toBe(false);
                });
            });
        });
        
        // check that the next pre-conflict window works properly
        // check that passing conflicts works
        // check that auto-passing conflicts works correctly
        // check that second conflict declaration works
        // check that play correctly proceeds to the fate phase
    });
});
