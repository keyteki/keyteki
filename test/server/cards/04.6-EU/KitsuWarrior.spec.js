describe('Kitsu Warrior', function () {
    integration(function () {
        describe('Kitsu Warrior\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsu-warrior']
                    },
                    player2: {
                        inPlay: ['doomed-shugenja','eager-scout'],
                        hand: ['cloud-the-mind']
                    }
                });
                this.kitsu = this.player1.findCardByName('kitsu-warrior');
                this.shug = this.player2.findCardByName('doomed-shugenja');
                this.cloud = this.player2.findCardByName('cloud-the-mind');


            });

            it('should correctly give 2 military skill for each military claimed ring', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.kitsu],
                    defenders: ['eager-scout'],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Take 1 honor from opponent');
                expect(this.game.rings.air.claimed).toBe(true);
                expect(this.kitsu.getMilitarySkill()).toBe(4);
                expect(this.kitsu.getPoliticalSkill()).toBe(2);
                this.player2.claimRing('fire');
                expect(this.game.rings.fire.claimed).toBe(true);
                expect(this.kitsu.getMilitarySkill()).toBe(6);
                expect(this.kitsu.getPoliticalSkill()).toBe(2);
            });

            it('should correctly give 2 political skill for each political claimed ring', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'earth',
                    attackers: [this.kitsu],
                    defenders: ['eager-scout'],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.game.rings.earth.claimed).toBe(true);
                expect(this.kitsu.getMilitarySkill()).toBe(2);
                expect(this.kitsu.getPoliticalSkill()).toBe(4);
                this.player2.claimRing('fire');
                expect(this.kitsu.getMilitarySkill()).toBe(4);
                expect(this.kitsu.getPoliticalSkill()).toBe(4);
            });

            it('should correctly modify skills if blanked', function () {
                this.player2.claimRing('fire');
                expect(this.kitsu.getMilitarySkill()).toBe(4);
                expect(this.kitsu.getPoliticalSkill()).toBe(2);
                this.player1.pass();
                this.player2.clickCard(this.cloud);
                this.player2.clickCard(this.kitsu);
                expect(this.kitsu.getMilitarySkill()).toBe(2);
                expect(this.kitsu.getPoliticalSkill()).toBe(2);
            });
        });
    });
});
