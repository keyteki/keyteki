describe('Ofushikai', function() {
    integration(function() {
        describe('Ofushikai attachment', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 3,
                        inPlay: ['shiba-tsukune', 'asako-tsuki', 'fearsome-mystic'],
                        hand: ['ofushikai']
                    },
                    player2: {
                        inPlay: ['crisis-breaker']
                    }
                });
                this.shibaTsukune = this.player1.findCardByName('shiba-tsukune');
                this.askaoTsuki = this.player1.findCardByName('asako-tsuki');
                this.fearsomeMysic = this.player1.findCardByName('fearsome-mystic');
            });

            it('should increase the attached characters military an political skills when attached', function() {
                this.player1.playAttachment('ofushikai', 'shiba-tsukune');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.shibaTsukune.getMilitarySkill()).toBe(this.shibaTsukune.getBaseMilitarySkill() + 2);
                expect(this.shibaTsukune.getPoliticalSkill()).toBe(this.shibaTsukune.getBasePoliticalSkill() + 3);
            });

            it('should grant the ability to a character that is a phoenix champion when attached', function() {
                let shibaTsukuneActionCount = this.shibaTsukune.getActions().length;
                this.player1.playAttachment('ofushikai', 'shiba-tsukune');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.shibaTsukune.getActions().length).toBe(shibaTsukuneActionCount + 1);
            });

            it('should not attach to a non-unique character', function() {
                this.player1.clickCard('ofushikai');
                expect(this.player1).not.toBeAbleToSelect(this.fearsomeMysic);
            });

            it('should not grant an ability to a character that is not a champion when attached', function() {
                let tsukiActionCount = this.askaoTsuki.getActions().length;
                this.player1.playAttachment('ofushikai', 'asako-tsuki');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.askaoTsuki.getActions().length).toBe(tsukiActionCount);
            });

            describe('during a conflict', function () {
                beforeEach(function () {
                    this.ofushikai = this.player1.playAttachment('ofushikai', 'shiba-tsukune');
                    this.crisisBreaker = this.player2.findCardByName('crisis-breaker');
                    this.noMoreActions();
                });

                it('should send a participating character home from the conflict if champion it is attached to is participating', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.shibaTsukune],
                        defenders: [this.crisisBreaker]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.shibaTsukune);
                    expect(this.player1).toHavePrompt('Choose a character');
                    this.player1.clickCard(this.crisisBreaker);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.crisisBreaker.inConflict).toBe(false);
                    let cannotParticipateAsAttackerEffects = this.crisisBreaker.effects.filter(effect => effect.type === 'cannotParticipateAsAttacker' && effect.duration === 'untilEndOfPhase');
                    expect(cannotParticipateAsAttackerEffects.length).toBeGreaterThan(0);
                });

                it('should not trigger action if champion it is attached to is not participating', function() {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.askaoTsuki],
                        defenders: [this.crisisBreaker]
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.shibaTsukune);
                    expect(this.player1).not.toHavePrompt('Choose a character');
                });
            });
        });
    });
});
