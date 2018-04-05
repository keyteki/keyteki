describe('Katana of Fire', function() {
    integration(function() {
        describe('If you control a Shugenja', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['Adept of the Waves'],
                        hand: ['Katana of Fire'],
                        provinces: {
                            'province 1': {
                                dynastyCards: ['doomed-shugenja']
                            }
                        }
                    }
                });
                this.katana = this.player1.hand[0];
                this.adept = this.player1.inPlay[0];
            });
            it('should let the player play the katana', function() {
                this.player1.clickCard(this.katana, 'hand');
                expect(this.player1).toHavePrompt('Choose a card');
            });
            describe('and you attach the katana to a character', function() {
                beforeEach(function() {
                    this.player1.attach(this.katana, this.adept, true);
                });

                it('should boost adept\'s military skill by at least 1 (counting itself)', function() {
                    expect(this.adept.getMilitarySkill()).toBe(this.adept.baseMilitarySkill + 1);
                });

                describe('and another fire card is added to play', function() {
                    beforeEach(function() {
                        this.skillBeforeMove = this.adept.getMilitarySkill();
                        this.player1.moveCard('doomed-shugenja', 'play area', 'provinces');
                    });
                    it('should boost adept\'s military skill by 1', function() {
                        expect(this.adept.getMilitarySkill()).toBe(this.skillBeforeMove + 1);
                    });
                });

                describe('and the fire ring is in your pool', function() {
                    beforeEach(function() {
                        this.skillBeforeClaim = this.adept.getMilitarySkill();
                        this.player1.claimRing('fire');
                    });
                    it('should increase the skill of the character by 2', function() {
                        expect(this.adept.getMilitarySkill()).toBe(this.skillBeforeClaim + 2);
                    });
                });
            });

        });
        describe('If you do not control a shugenja', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        hand: ['Katana of Fire'],
                        provinces: {
                            'province 1': {
                                dynastyCards: ['doomed-shugenja']
                            }
                        }
                    }
                });

                this.katana = this.player1.hand[0];
            });
            it('should not let the player play the katana', function() {
                this.player1.clickCard(this.katana, 'hand');
                expect(this.player1).not.toHavePrompt('Choose a card');
            });
        });
    });
});
