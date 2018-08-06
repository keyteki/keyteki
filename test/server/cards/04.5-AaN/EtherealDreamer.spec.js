describe('Ethereal Dreamer', function() {
    integration(function() {
        describe('Ethereal Dreamer\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 11,
                        fate: 5,
                        inPlay: ['ethereal-dreamer'],
                        hand: ['seeker-of-knowledge']
                    },
                    player2: {
                        honor: 11,
                        provinces: ['kuroi-mori']
                    }
                });
                this.dreamer = this.player1.findCardByName('ethereal-dreamer');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
            });

            it('should trigger when the conflict phase starts', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.dreamer);
            });

            describe('when a ring has been targeted', function() {
                beforeEach(function() {
                    this.seeker = this.player1.findCardByName('seeker-of-knowledge', 'hand');
                    this.player1.clickCard(this.dreamer);
                    this.player1.clickRing('air');
                    this.noMoreActions();
                });

                it('should not boost skill when contesting a non-targeted rings', function() {
                    this.initiateConflict({
                        ring: 'void',
                        attackers: [this.dreamer],
                        defenders: []
                    });

                    expect(this.dreamer.getMilitarySkill()).toBe(1);
                    expect(this.dreamer.getPoliticalSkill()).toBe(1);
                });

                it('should not boost skill if the contested ring gains the targeted ring\'s element', function() {
                    this.initiateConflict({
                        ring: 'void',
                        attackers: [this.dreamer],
                        defenders: []
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.seeker);
                    this.player1.clickPrompt('1');

                    expect(this.dreamer.getMilitarySkill()).toBe(1);
                    expect(this.dreamer.getPoliticalSkill()).toBe(1);
                });

                describe('after initiating a conflict with the targeted ring', function() {
                    beforeEach(function() {
                        this.initiateConflict({
                            ring: 'air',
                            province: 'kuroi-mori',
                            attackers: [this.dreamer],
                            defenders: []
                        });
                    });

                    it('should boost skill her skill by +2/+2', function() {
                        expect(this.dreamer.getMilitarySkill()).toBe(3);
                        expect(this.dreamer.getPoliticalSkill()).toBe(3);
                    });

                    it('should remove her skill boost if the contested ring changes', function() {
                        this.player2.clickCard('kuroi-mori', 'provinces');
                        this.player2.clickPrompt('Switch the contested ring');
                        this.player2.clickRing('void');
                        expect(this.dreamer.getMilitarySkill()).toBe(1);
                        expect(this.dreamer.getPoliticalSkill()).toBe(1);
                    });

                    it('should remove her skill boost when the ring is no longer contested', function() {
                        this.noMoreActions();
                        this.player1.clickPrompt('Don\'t resolve');
                        expect(this.dreamer.getMilitarySkill()).toBe(1);
                        expect(this.dreamer.getPoliticalSkill()).toBe(1);
                    });
                });
            });
        });
    });
});
