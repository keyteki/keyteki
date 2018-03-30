describe('Yogo Hiroue', function() {
    integration(function() {
        describe('Hiroue\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yogo-hiroue', 'yogo-outcast'],
                        hand: ['unassuming-yojimbo', 'assassination']
                    },
                    player2: {
                        honor: 10,
                        inPlay: ['miwaku-kabe-guard', 'seppun-guardsman', 'kitsu-spiritcaller'],
                        dynastyDeck: ['favorable-ground']
                    }
                });
                this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['yogo-hiroue'],
                    defenders: []
                });
                this.player2.pass();
                this.yogoHiroue = this.player1.clickCard('yogo-hiroue');
                this.miwakuKabeGuard = this.player2.findCardByName('miwaku-kabe-guard');
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
            });

            it('should move an friendly character into the conflict', function() {
                this.yogoOutcast = this.player1.clickCard('yogo-outcast');
                expect(this.yogoOutcast.inConflict).toBe(true);
                expect(this.game.currentConflict.attackers).toContain(this.yogoOutcast);
            });

            it('should move an enemy character into the conflict', function() {
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.inConflict).toBe(true);
                expect(this.game.currentConflict.defenders).toContain(this.seppunGuardsman);
            });

            it('should let the player trigger the delayed effect for a friendly character', function() {
                this.yogoOutcast = this.player1.clickCard('yogo-outcast');
                expect(this.game.effectEngine.delayedEffects.length).toBe(1);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Yogo Hiroue');
                this.player1.clickPrompt('Yes');
                expect(this.yogoOutcast.isDishonored).toBe(true);
            });

            it('should let the player trigger the delayed effect for an enemy character', function() {
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.game.effectEngine.delayedEffects.length).toBe(1);
                this.player2.pass();
                this.player1.playCharacterFromHand('unassuming-yojimbo');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Yogo Hiroue');
                this.player1.clickPrompt('Yes');
                expect(this.seppunGuardsman.isDishonored).toBe(true);
            });

            it('should trigger the delayed effect even if the card is no longer in the conflict', function() {
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.game.effectEngine.delayedEffects.length).toBe(1);
                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.inConflict).toBe(false);
                expect(this.game.currentConflict.defenders).not.toContain(this.seppunGuardsman);
                this.player1.playCharacterFromHand('unassuming-yojimbo');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Yogo Hiroue');
                this.player1.clickPrompt('Yes');
                expect(this.seppunGuardsman.isDishonored).toBe(true);
            });

            it('should not trigger the delayed effect if the card has left play', function() {
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.game.effectEngine.delayedEffects.length).toBe(1);
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.game.effectEngine.delayedEffects.length).toBe(0);
                this.player2.pass();
                this.player1.playCharacterFromHand('unassuming-yojimbo');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effects');
            });

            it('should not trigger the delayed effect if the card returns to play', function() {
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.game.effectEngine.delayedEffects.length).toBe(1);
                this.player2.pass();
                this.player1.clickCard('assassination');
                this.player1.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.location).toBe('dynasty discard pile');
                expect(this.game.effectEngine.delayedEffects.length).toBe(0);
                this.player2.clickCard('kitsu-spiritcaller');
                this.player2.clickCard(this.seppunGuardsman);
                expect(this.seppunGuardsman.inConflict).toBe(true);
                expect(this.seppunGuardsman.location).toBe('play area');
                this.player1.playCharacterFromHand('unassuming-yojimbo');
                this.player1.clickPrompt('Conflict');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Resolve Ring Effects');
            });
        });
    });
});
                
