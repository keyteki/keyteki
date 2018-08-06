describe('Soul Beyond Reproach', function() {
    integration(function() {
        describe('Soul Beyond Reproach\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-hotaru', 'kakita-yoshi', 'kakita-kaezin'],
                        hand: ['soul-beyond-reproach']
                    },
                    player2: {
                        inPlay: ['young-rumormonger']
                    }
                });
                this.soulBeyondReproach = this.player1.findCardByName('soul-beyond-reproach');
                this.hotaru = this.player1.findCardByName('doji-hotaru');
                this.hotaru.dishonor();
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.kaezin = this.player1.findCardByName('kakita-kaezin');
                this.kaezin.honor();
                this.rumormonger = this.player2.findCardByName('young-rumormonger');
            });

            describe('When selecting a target character', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                });
                it('should not be allowed to target opponents characters', function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).not.toBeAbleToSelect(this.rumormonger);
                });
                it('should not be allowed to target honored characters', function() {
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).not.toBeAbleToSelect(this.kaezin);
                });
                it('should be allowed to target ordinary charcters', function() {
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).toBeAbleToSelect(this.yoshi);
                });
                it('should be allowed to target dishonored charcters', function() {
                    expect(this.player1).toHavePrompt('Soul Beyond Reproach');
                    expect(this.player1).toBeAbleToSelect(this.hotaru);
                });
            });

            describe('When successfully played on a character in ordinary state', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    this.player1.clickCard(this.yoshi);
                    this.player2.clickPrompt('Pass');
                });

                it('should result in the target being in honored state', function() {
                    expect(this.yoshi.isHonored).toBe(true);
                });
            });

            describe('When successfully played on a character in dishonored state', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    this.player1.clickCard(this.hotaru);
                    this.player2.clickPrompt('Pass');
                });

                it('should result in the target being in ordinary state and then honored state', function() {
                    expect(this.hotaru.isDishonored).toBe(false);
                    expect(this.hotaru.isHonored).toBe(false);
                    this.player2.clickPrompt('Pass');
                    this.player1.clickCard(this.hotaru);
                    expect(this.hotaru.isHonored).toBe(true);
                });
            });

            describe('When the initial honor action is not successfully resolved', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.soulBeyondReproach);
                    this.player1.clickCard(this.hotaru);
                });
                it('should not apply the post-THEN second honor action', function() {
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.rumormonger);
                    this.player2.clickCard(this.rumormonger);
                    this.player2.clickCard(this.yoshi);
                    expect(this.hotaru.isDishonored).toBe(true);
                    expect(this.yoshi.isHonored).toBe(true);
                });
            });
        });
    });
});
