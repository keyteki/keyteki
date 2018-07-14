describe('Smoke', function () {
    integration(function () {
        describe('Smoke\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 5,
                        inPlay: ['moto-juro', 'border-rider'],
                        hand: ['smoke']
                    },
                    player2: {
                        inPlay: ['shinjo-tatsuo', 'shinjo-scout']
                    }
                });
                this.juro = this.player1.findCardByName('moto-juro');
                this.smoke = this.player1.findCardByName('smoke', 'hand');
                this.player1.clickCard(this.smoke);
                this.player1.clickCard(this.juro);
                this.noMoreActions();
            });

            it('should trigger while the attached card is participating', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-juro', 'border-rider'],
                    defenders: ['shinjo-tatsuo', 'shinjo-scout']
                });
                this.player2.pass();
                this.player1.clickCard(this.smoke);
                expect(this.smoke.location).toBe('conflict discard pile');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger while the attached card is not participating', function () {
                this.initiateConflict({
                    type: 'military',
                    attackers: ['border-rider'],
                    defenders: ['shinjo-tatsuo', 'shinjo-scout']
                });
                this.player2.pass();
                this.player1.clickCard(this.smoke);
                expect(this.smoke.location).toBe('play area');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not trigger while smoke is bowed', function () {
                this.smoke.bowed = true;
                this.initiateConflict({
                    type: 'military',
                    attackers: ['moto-juro', 'border-rider'],
                    defenders: ['shinjo-tatsuo', 'shinjo-scout']
                });
                this.player2.pass();
                this.player1.clickCard(this.smoke);
                expect(this.smoke.location).toBe('play area');
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            describe('during a conflict in which it\'s ability has been triggered', function () {
                beforeEach(function () {
                    this.rider = this.player1.findCardByName('border-rider');
                    this.tatsuo = this.player2.findCardByName('shinjo-tatsuo');
                    this.scout = this.player2.findCardByName('shinjo-scout');
                    this.initiateConflict({
                        type: 'military',
                        attackers: ['moto-juro', 'border-rider'],
                        defenders: ['shinjo-tatsuo', 'shinjo-scout']
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.smoke);
                });

                it('should reduce the military skill of all non-unique participants by 2', function () {
                    expect(this.rider.getMilitarySkill()).toBe(this.rider.cardData.military - 2);
                    expect(this.scout.getMilitarySkill()).toBe(this.scout.cardData.military - 2);
                });

                it('should not effect the military skill of all unique participants', function () {
                    expect(this.juro.getMilitarySkill()).toBe(this.juro.cardData.military);
                    expect(this.tatsuo.getMilitarySkill()).toBe(this.tatsuo.cardData.military);
                });

                it('should last until the end of the conflict', function () {
                    this.noMoreActions();
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.rider.getMilitarySkill()).toBe(this.rider.cardData.military);
                    expect(this.scout.getMilitarySkill()).toBe(this.scout.cardData.military);
                });
            });
        });
    });
});
