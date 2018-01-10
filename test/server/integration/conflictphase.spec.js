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
                this.player1.player.putIntoPlay(this.sinisterSoshi);
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
                    this.player1.player.putIntoPlay(this.sinisterSoshi);
                    this.player1.player.putIntoPlay(this.doomedShugenja);
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
                
                expect(this.player1).toHavePrompt('Any reactions?');
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
                
                expect(this.player2).toHavePrompt('Any reactions?');
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
                
                expect(this.player2).toHavePrompt('Any reactions?');
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
                
                expect(this.player1).toHavePrompt('Any reactions?');
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
        // check return home and reactions to it work correctly
        // check that the next pre-conflict window works properly
        // check that passing conflicts works
        // check that auto-passing conflicts works correctly
        // check that second conflict declaration works
        // check that play correctly proceeds to the fate phase
        xdescribe('when a character has stealth', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Sneak Attack',
                    'Tyrion Lannister (Core)', 'Joffrey Baratheon (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Tyrion Lannister', 'hand');
                this.player2.clickCard('Joffrey Baratheon', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Tyrion Lannister', 'play area');
                this.player1.clickPrompt('Done');
            });

            it('should prompt for stealth targets before reactions', function() {
                let stealthTarget = this.player2.findCardByName('Joffrey Baratheon', 'play area');

                expect(this.player1).toHavePrompt('Select stealth target for Tyrion Lannister');

                this.player1.clickCard(stealthTarget);

                expect(this.player1).toHavePromptButton('Tyrion Lannister');
                expect(stealthTarget.stealth).toBe(true);
            });
        });

        xdescribe('when a side has higher strength but no participating characters', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', [
                    'Sneak Attack',
                    'Steward at the Wall', 'The Haunted Forest', 'The Haunted Forest', 'The Shadow Tower'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Steward at the Wall', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Shadow Tower', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                
                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Steward at the Wall', 'play area');
                this.player1.clickPrompt('Done');

                // Skip attackers declared window
                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                // Skip defenders declared window
                this.skipActionWindow();
            });

            it('should not trigger any win reactions for the defender', function() {
                expect(this.player2).not.toHavePromptButton('The Shadow Tower');
            });

            it('should complete the challenge', function() {
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHavePromptButton('Intrigue');
                expect(this.player1).toHavePromptButton('Power');
            });
        });

        xdescribe('when initiating a challenge', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Trading with the Pentoshi',
                    'Tyrion Lannister (Core)', 'Dornish Paramour', 'Marya Seaworth', 'Jojen Reed', 'Hedge Knight', 'Lannisport Merchant'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
                this.merchant = this.player2.findCardByName('Lannisport Merchant', 'hand');

                this.player1.clickCard('Tyrion Lannister', 'hand');
                this.player1.clickCard('Dornish Paramour', 'hand');
                this.player2.clickCard(this.knight);
                this.player2.clickCard(this.merchant);
                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard('Marya Seaworth', 'hand');
                this.player1.clickCard('Jojen Reed', 'hand');
                this.completeMarshalPhase();

                this.initiateChallenge = () => {
                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard('Tyrion Lannister', 'play area');
                    this.player1.clickCard('Jojen Reed', 'play area');
                    this.player1.clickCard('Dornish Paramour', 'play area');
                    this.player1.clickPrompt('Done');

                    // Select 2 stealth targets
                    this.player1.clickCard(this.knight);
                    this.player1.clickCard(this.merchant);
                };
            });

            it('should prompt for challenge initiated, attackers declared, and stealth simultaneously', function() {
                this.initiateChallenge();

                expect(this.player1).toHavePromptButton('Tyrion Lannister');
                expect(this.player1).toHavePromptButton('Dornish Paramour');
                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Hedge Knight');
                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Lannisport Merchant');
                expect(this.player1.currentPrompt().buttons.length).toBe(5);
            });

            it('should reactions in the same window to generate gold needed to pay costs', function() {
                this.player1Object.gold = 0;
                this.initiateChallenge();
                expect(this.player1).not.toHavePromptButton('Marya Seaworth - Kneel Hedge Knight');
                expect(this.player1).not.toHavePromptButton('Marya Seaworth - Kneel Lannisport Merchant');

                this.player1.clickPrompt('Tyrion Lannister');

                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Hedge Knight');
                expect(this.player1).toHavePromptButton('Marya Seaworth - Kneel Lannisport Merchant');
            });
        });
    });
});
