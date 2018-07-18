describe('Yoritomo', function() {
    integration(function() {
        describe('Yoritomo\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 2,
                        inPlay: ['yoritomo'],
                        hand: ['seeker-of-knowledge'],
                        dynastyDeck: ['windswept-yurt']
                    },
                    player2: {
                        fate: 2,
                        inPlay: ['miya-mystic'],
                        hand: ['cloud-the-mind']
                    }
                });

                this.yoritomo = this.player1.findCardByName('yoritomo');
                this.yurt = this.player1.placeCardInProvince('windswept-yurt', 'province 1');
                this.baseSkill = this.yoritomo.cardData.military;
                this.initialFate = this.player1.fate;
            });

            it('should set his initial skill modifier to an amount equal to his controller\'s fate pool', function() {
                expect(this.yoritomo.getMilitarySkill()).toBe(this.baseSkill + this.initialFate);
            });

            it('should increase his skill modifier any time his fate pool increases', function() {
                this.player1.clickCard(this.yurt);
                this.player1.clickPrompt('Each player gains 2 fate');
                expect(this.yoritomo.getMilitarySkill()).toBe(this.baseSkill + this.initialFate + 2);
            });

            it('should decrease his skill modifier any time his fate pool decreases', function() {
                this.player1.clickCard('seeker-of-knowledge', 'hand');
                this.player1.clickPrompt('0');
                expect(this.yoritomo.getMilitarySkill()).toBe(this.baseSkill + this.initialFate - 2);
            });

            it('should be disabled if his textbox is blanked', function() {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('cloud-the-mind', 'hand');
                this.player2.clickCard(this.yoritomo);
                expect(this.yoritomo.getMilitarySkill()).toBe(this.baseSkill);
            });
        });
    });
});
