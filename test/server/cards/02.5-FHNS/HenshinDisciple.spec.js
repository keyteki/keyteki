describe('Henshin Disciple', function() {
    integration(function() {
        describe('Henshin Disciple\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['henshin-disciple', 'seeker-of-knowledge'],
                        hand: ['know-the-world']
                    }
                });
                this.game.rings.void.claimRing(this.player1.player);
                this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 1');
                this.shamefulDisplay.facedown = false;
                this.henshinDisciple = this.player1.findCardByName('henshin-disciple');
            });

            describe('should give him +2 pol', function() {
                it('during an air conflict', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        ring: 'air',
                        province: this.shamefulDisplay,
                        attackers: [this.henshinDisciple],
                        defenders: []
                    });
                    expect(this.henshinDisciple.getPoliticalSkill()).toBe(4);
                });

                it('when the air ring is claimed', function() {
                    this.player1.clickCard('know-the-world');
                    this.player1.clickRing('void');
                    this.player1.clickRing('air');
                    expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
                    expect(this.henshinDisciple.getPoliticalSkill()).toBe(4);
                });
            });

            describe('should give him +2 mil', function() {
                it('during an earth conflict', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        ring: 'earth',
                        province: this.shamefulDisplay,
                        attackers: [this.henshinDisciple],
                        defenders: []
                    });
                    expect(this.henshinDisciple.getMilitarySkill()).toBe(4);
                });

                it('when the earth ring is claimed', function() {
                    this.player1.clickCard('know-the-world');
                    this.player1.clickRing('void');
                    this.player1.clickRing('earth');
                    expect(this.game.rings.earth.claimedBy).toBe(this.player1.player.name);
                    expect(this.henshinDisciple.getMilitarySkill()).toBe(4);
                });
            });

            describe('should give him pride', function() {
                it('during a fire conflict', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        ring: 'fire',
                        province: this.shamefulDisplay,
                        attackers: [this.henshinDisciple],
                        defenders: []
                    });
                    expect(this.henshinDisciple.hasPride()).toBe(true);
                });

                it('when the fire ring is claimed', function() {
                    this.player1.clickCard('know-the-world');
                    this.player1.clickRing('void');
                    this.player1.clickRing('fire');
                    expect(this.game.rings.fire.claimedBy).toBe(this.player1.player.name);
                    expect(this.henshinDisciple.hasPride()).toBe(true);
                });
            });
        });
    });
});
