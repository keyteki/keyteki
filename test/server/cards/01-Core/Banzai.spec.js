describe('Banzai!', function() {
    integration(function() {
        describe('Banzai\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['miya-mystic', 'seppun-guardsman'],
                        hand: ['banzai', 'banzai']
                    },
                    player2: {
                        dynastyDeck: ['bayushi-liar'],
                        hand: ['forged-edict']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.seppunGuardsman = this.player1.findCardByName('seppun-guardsman');
                this.bayushiLiar = this.player2.placeCardInProvince('bayushi-liar');
                this.banzai = this.player1.findCardByName('banzai');
                this.noMoreActions();
            });

            it('should only work on participating characters', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                expect(this.player1).toHavePrompt('Banzai!');
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).not.toBeAbleToSelect(this.seppunGuardsman);
            });

            it('should give +2/+0', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                expect(this.miyaMystic.getMilitarySkill()).toBe(3);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(1);
            });

            it('should allow player to spend an honor', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePromptButton('Lose 1 honor to resolve this ability again');
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt for a new target', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                expect(this.player1).toBeAbleToSelect(this.seppunGuardsman);
            });

            it('should deduct an honor and give an extra +2/+0', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Done');
                expect(this.miyaMystic.getMilitarySkill()).toBe(5);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(1);
                expect(this.player1.player.honor).toBe(9);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should give the player an opportunity to lose a 2nd honor', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player1).toHavePromptButton('Lose 1 honor for no effect');
                this.player1.clickPrompt('Lose 1 honor for no effect');
                expect(this.miyaMystic.getMilitarySkill()).toBe(5);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(1);
                expect(this.player1.player.honor).toBe(8);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('shouldn\'t be usable twice in a single conflict', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickPrompt('Done');
                this.player2.pass();
                this.banzai2 = this.player1.findCardByName('banzai', 'hand');
                this.player1.clickCard(this.banzai2);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should allow cancelling at first prompt', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.putIntoPlay(this.bayushiLiar);
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('forged-edict');
                this.player2.clickCard('forged-edict');
                this.player2.clickCard(this.bayushiLiar);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.miyaMystic.getMilitarySkill()).toBe(1);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(1);
            });

            it('should allow cancelling at second prompt', function() {
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.miyaMystic, this.seppunGuardsman],
                    defenders: []
                });
                this.player2.putIntoPlay(this.bayushiLiar);
                this.player2.pass();
                this.player1.clickCard(this.banzai);
                this.player1.clickCard(this.miyaMystic);
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Lose 1 honor to resolve this ability again');
                this.player1.clickCard(this.miyaMystic);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('forged-edict');
                this.player2.clickCard('forged-edict');
                this.player2.clickCard(this.bayushiLiar);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.miyaMystic.getMilitarySkill()).toBe(3);
                expect(this.miyaMystic.getPoliticalSkill()).toBe(1);
                expect(this.player1.player.honor).toBe(9);
            });
        });
    });
});
