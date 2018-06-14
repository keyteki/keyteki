describe('Togashi Yokuni', function() {
    integration(function() {
        describe('Togashi Yokuni\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['seeker-of-knowledge', 'assassination']
                    },
                    player2: {
                        inPlay: ['border-rider', 'shiba-tsukune', 'asako-diplomat', 'isawa-masahiro'],
                        hand: ['cloud-the-mind'],
                        dynastyDeck: ['adept-of-the-waves']
                    }
                });
                this.borderRider = this.player2.findCardByName('border-rider');
                this.shibaTsukune = this.player2.findCardByName('shiba-tsukune');
                this.asakoDiplomat = this.player2.findCardByName('asako-diplomat');
                this.isawaMasahiro = this.player2.findCardByName('isawa-masahiro');
                this.adeptOfTheWaves = this.player2.placeCardInProvince('adept-of-the-waves');
            });

            it('should allow copying of an ability', function() {
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                expect(this.player1).toHavePrompt('Togashi Yokuni');
                this.player1.clickCard(this.borderRider);
                this.togashiYokuni.bowed = true;
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.bowed).toBe(false);
            });

            it('should allow copying of an ability with targets', function() {
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: ['togashi-yokuni'],
                    defenders: ['asako-diplomat']
                });
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.isawaMasahiro);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.asakoDiplomat);
                expect(this.asakoDiplomat.location).toBe('dynasty discard pile');
                expect(this.togashiYokuni.bowed).toBe(true);
            });

            it('should work on abilities which depend on player characteristics', function() {
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'fire',
                    attackers: ['togashi-yokuni'],
                    defenders: ['asako-diplomat']
                });
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.asakoDiplomat);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.togashiYokuni);
                this.player1.clickCard(this.togashiYokuni);
                expect(this.player1).toHavePrompt('Togashi Yokuni');
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Honor Togashi Yokuni');
                expect(this.togashiYokuni.isHonored).toBe(true);
            });

            it('should allow copying of blanked abilities', function() {
                this.player1.pass();
                this.player2.playAttachment('cloud-the-mind', this.borderRider);
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.borderRider);
                this.togashiYokuni.bowed = true;
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.bowed).toBe(false);
            });

            it('should allow use of copied abilities when blanked', function() {
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.borderRider);
                this.togashiYokuni.bowed = true;
                this.player2.playAttachment('cloud-the-mind', this.togashiYokuni);
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.bowed).toBe(false);
            });

            it('should allow copying of an ability which triggers at the end of the phase', function() {
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.shibaTsukune);
                this.togashiYokuni.bowed = true;
                this.shibaTsukune.bowed = true;
                this.asakoDiplomat.bowed = true;
                this.isawaMasahiro.bowed = true;
                this.borderRider.bowed = true;
                this.noMoreActions();
                this.noMoreActions();
                this.noMoreActions();
                this.noMoreActions();
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickRing('fire');
                this.player1.clickRing('water');
                expect(this.player1).toHavePrompt('Water Ring');
            });
        });

        describe('Togashi Yokuni/Togashi Kazue interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['togashi-kazue']
                    }
                });
            });

            it('should not let Yokuni copy Kazue as an attachment', function() {
                this.togashiKazue = this.player1.playAttachment('togashi-kazue', 'togashi-yokuni');
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not let Yokuni copy Kazue as a character', function() {
                this.togashiKazue = this.player1.playCharacterFromHand('togashi-kazue');
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Togashi Yokuni/Adept of Shadows interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['adept-of-shadows']
                    }
                });
            });

            it('should allow Yokuni to return to hand and be played as a conflict char', function() {
                this.adept = this.player1.playCharacterFromHand('adept-of-shadows');
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.adept);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.location).toBe('hand');
                this.player2.pass();
                this.player1.playCharacterFromHand(this.togashiYokuni);
                expect(this.togashiYokuni.location).toBe('play area');
            });

            it('should not allow Yokuni to return to hand and use his ability again', function() {
                this.adept = this.player1.playCharacterFromHand('adept-of-shadows');
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.adept);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.location).toBe('hand');
                this.player2.pass();
                this.player1.playCharacterFromHand(this.togashiYokuni);
                expect(this.togashiYokuni.location).toBe('play area');
                this.player2.pass();
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Togashi Yokuni and max abilities', function() {
            beforeEach(function() {
                //this.spy = spyOn(this.game, 'reportError');
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni', 'kitsuki-investigator'],
                        hand: ['way-of-the-dragon']
                    },
                    player2: {
                        hand: ['banzai', 'banzai', 'banzai']
                    }
                });
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.kitsukiInvestigator = this.player1.clickCard('kitsuki-investigator');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['togashi-yokuni', 'kitsuki-investigator'],
                    defenders: []
                });
            });

            it('should allow both yokuni and investigator to use their abilities in the same conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Banzai! (3)');
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Banzai! (2)');
                expect(this.game.rings.fire.fate).toBe(2);
                expect(this.player2.player.hand.size()).toBe(1);                
            });

            it('should not allow Kitsuki Investigator to use its ability twice with Way of the Dragon', function() {
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Banzai! (3)');
                this.player2.pass();
                this.player1.playAttachment('way-of-the-dragon', this.kitsukiInvestigator);
                this.player2.pass();
                this.player1.clickCard(this.kitsukiInvestigator);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.player2.player.hand.size()).toBe(2);                
            });

            it('should not allow Togashi Yokuni to use its ability twice with Way of the Dragon', function() {
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickRing('fire');
                this.player1.clickPrompt('Banzai! (3)');
                this.player2.pass();
                this.player1.playAttachment('way-of-the-dragon', this.togashiYokuni);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.game.rings.fire.fate).toBe(1);
                expect(this.player2.player.hand.size()).toBe(2);                
            });
        });
        
        describe('Togashi Yokuni/Bayushi Shoju interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni']
                    },
                    player2: {
                        inPlay: ['bayushi-shoju', 'bayushi-manipulator', 'tattooed-wanderer']
                    }
                });
                this.bayushiShoju = this.player2.findCardByName('bayushi-shoju');
                this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
                this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer');
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.bayushiShoju);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['togashi-yokuni'],
                    defenders: [this.bayushiManipulator, this.tattooedWanderer]
                });
                this.player2.pass();
            });

            it('should trigger the terminal condition from Shoju\'s ability correctly', function() {
                this.messageSpy = spyOn(this.game, 'addMessage');
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.bayushiManipulator);
                expect(this.messageSpy).toHaveBeenCalledWith('{1} is discarded due to {0}\'s lasting effect', this.togashiYokuni, this.bayushiManipulator);
                expect(this.bayushiManipulator.location).toBe('dynasty discard pile');
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.tattooedWanderer);
                expect(this.messageSpy).toHaveBeenCalledWith('{1} is discarded due to {0}\'s lasting effect', this.togashiYokuni, this.tattooedWanderer);
                expect(this.tattooedWanderer.location).toBe('conflict discard pile');
            });
        });
        
        describe('Togashi Yokuni/Yogo Hiroue interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['yogo-hiroue', 'bayushi-manipulator']
                    },
                    player2: {
                        inPlay: ['togashi-yokuni']
                    }
                });
                this.togashiYokuni = this.player2.findCardByName('togashi-yokuni');
                this.yogoHiroue = this.player1.findCardByName('yogo-hiroue');
                this.bayushiManipulator = this.player1.findCardByName('bayushi-manipulator');
            });

            it('should correctly trigger the delayed part of Hiroue\'s ability', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.yogoHiroue],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.yogoHiroue);
                this.player1.clickCard(this.togashiYokuni);
                this.player2.clickCard(this.togashiYokuni);
                this.player2.clickCard(this.yogoHiroue);
                this.player1.pass();
                this.player2.clickCard(this.togashiYokuni);
                this.player2.clickCard(this.bayushiManipulator);
                this.noMoreActions();
                expect(this.togashiYokuni.inConflict).toBe(true);
                expect(this.bayushiManipulator.inConflict).toBe(true);
                expect(this.player2).toHavePrompt('Togashi Yokuni');
                this.player2.clickPrompt('Yes');
                expect(this.bayushiManipulator.isDishonored).toBe(true);
            });

            it('should require 2 targets', function() {

            });
        });
        
        describe('Togashi Yokuni/Illustrious Plagiarist interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['way-of-the-dragon', 'banzai']
                    },
                    player2: {
                        inPlay: ['illustrious-plagiarist'],
                        hand: ['banzai', 'a-legion-of-one']
                    }
                });
                this.player1.playAttachment('way-of-the-dragon', 'togashi-yokuni');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['togashi-yokuni'],
                    defenders: ['illustrious-plagiarist']
                });
            });

            it('should allow Yokuni to copy Plagiarist, and get 4 uses of an event', function() {
                this.legionOfOne = this.player2.clickCard('a-legion-of-one');
                this.illustriousPlagiarist = this.player2.clickCard('illustrious-plagiarist');
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.illustriousPlagiarist);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.legionOfOne);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Give a solitary character +3/+0');
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.getMilitarySkill()).toBe(9);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Give a solitary character +3/+0');
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.getMilitarySkill()).toBe(12);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.legionOfOne);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.getMilitarySkill()).toBe(15);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.getMilitarySkill()).toBe(18);
            });

            it('should allow Yokuni to copy Plagiarist and play Banzai from hand and from Yokuni, but not from Yokuni twice', function() {
                // Banzai! on Plagiarist
                this.banzai = this.player2.clickCard('banzai');
                this.illustriousPlagiarist = this.player2.clickCard('illustrious-plagiarist');
                this.player2.clickPrompt('Done');
                // Yokuni copies Plagiarist
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.illustriousPlagiarist);
                this.player2.pass();
                // Yokuni copies Banzai!
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.banzai);
                // Legion of One on Plagiarist
                this.legionOfOne = this.player2.clickCard('a-legion-of-one');
                this.player2.clickCard(this.illustriousPlagiarist);
                // Banzai! on Yokuni
                this.player1.clickCard('banzai');
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Done');
                expect(this.togashiYokuni.getMilitarySkill()).toBe(8);                
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Increase a character\'s military skill');
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickPrompt('Done');
                expect(this.togashiYokuni.getMilitarySkill()).toBe(10);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.player1.clickCard(this.legionOfOne);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);            
                this.player1.clickCard(this.togashiYokuni);            
                expect(this.togashiYokuni.getMilitarySkill()).toBe(13);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);            
                this.player1.clickCard(this.togashiYokuni);            
                expect(this.togashiYokuni.getMilitarySkill()).toBe(16);
            });
        });

        describe('Togashi Yokuni/Kitsu Spiritcaller interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        dynastyDiscard: ['agasha-sumiko']
                    },
                    player2: {
                        inPlay: ['kitsu-spiritcaller'],
                        dynastyDiscard: ['akodo-toturi']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['togashi-yokuni'],
                    defenders: []
                });
            });

            it('should correctly copy Spiritcaller\'s ability', function() {
                this.spiritcaller = this.player2.clickCard('kitsu-spiritcaller');
                this.toturi = this.player2.clickCard('akodo-toturi');
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.spiritcaller);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                this.sumiko = this.player1.clickCard('agasha-sumiko');
                expect(this.toturi.location).toBe('play area');
                expect(this.sumiko.location).toBe('play area');
                this.noMoreActions();
                this.player2.pass();
                expect(this.sumiko.location).toBe('dynasty deck');
                expect(this.toturi.location).toBe('dynasty deck');
            });
        });

        describe('Togashi Yokuni/Akodo Toshiro interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni']
                    },
                    player2: {
                        inPlay: ['akodo-toshiro', 'honored-general']
                    }
                });
                this.akodoToshiro = this.player2.findCardByName('akodo-toshiro');
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.akodoToshiro);
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: []
                });
            });

            it('should correctly copy Toshiro\'s ability', function() {
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.getMilitarySkill()).toBe(10);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Gain 2 honor');
                expect(this.togashiYokuni.location).toBe('dynasty discard pile');
            });

            it('should require 2 targets', function() {

            });
        });

        describe('Togashi Yokuni/Fire Elemental Guard interaction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-yokuni'],
                        hand: ['against-the-waves', 'cloud-the-mind', 'against-the-waves']
                    },
                    player2: {
                        inPlay: ['fire-elemental-guard'],
                        hand: ['against-the-waves', 'fiery-madness']
                    }
                });
                this.elementalGuard = this.player2.findCardByName('fire-elemental-guard');
                this.togashiYokuni = this.player1.clickCard('togashi-yokuni');
                this.player1.clickCard(this.elementalGuard);
                this.noMoreActions();
                this.initiateConflict({
                    ring: 'air',
                    type: 'military',
                    attackers: [this.togashiYokuni],
                    defenders: [this.elementalGuard]
                });
            });

            it('should only allow Yokuni to use the ability when his controller has played 3 spells', function() {
                this.player2.clickCard('against-the-waves');
                this.player2.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.bowed).toBe(true);
                this.player1.clickCard('against-the-waves');
                this.player1.clickCard(this.togashiYokuni);
                expect(this.togashiYokuni.bowed).toBe(false);
                this.fieryMadness = this.player2.playAttachment('fiery-madness', this.togashiYokuni);
                this.player1.playAttachment('cloud-the-mind', this.elementalGuard);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard('against-the-waves', 'hand');
                this.player1.clickCard(this.elementalGuard);
                expect(this.elementalGuard.bowed).toBe(true);
                this.player2.pass();
                this.player1.clickCard(this.togashiYokuni);
                expect(this.player1).toHavePrompt('Togashi Yokuni');
                this.player1.clickCard(this.fieryMadness);
                expect(this.fieryMadness.location).toBe('conflict discard pile');
            });
        });
    });
});
