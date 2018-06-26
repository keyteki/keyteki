describe('Isawa Uona', function () {
    integration(function () {
        describe('Isawa Uona\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-outrider', 'moto-juro'],
                        hand: [],
                        dynastyDeck: ['keeper-initiate']
                    },
                    player2: {
                        fate: 5,
                        inPlay: ['isawa-uona', 'shiba-peacemaker'],
                        hand: ['cloud-the-mind'],
                        conflictDeck: ['fine-katana', 'watch-commander', 'favored-mount']
                    }
                });
                this.uona = this.player2.findCardByName('Isawa Uona', 'play area');
                this.outrider = this.player1.findCardByName('Shinjo Outrider', 'play area');
                this.juro = this.player1.findCardByName('Moto Juro', 'play area');
            });

            it('should not trigger in a pre-conflict window', function () {
                this.player1.clickPrompt('Pass');
                this.player2.clickCard('cloud-the-mind');
                this.player2.clickCard(this.outrider);
                expect(this.player1).toHavePrompt('Initiate an action');
            });

            describe('during a conflict', function () {
                beforeEach(function () {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        ring: 'air',
                        defenders: ['shiba-peacemaker'],
                        attackers: ['shinjo-outrider', 'moto-juro']
                    });
                    this.player2.clickCard('cloud-the-mind');
                    this.player2.clickCard(this.outrider);
                });

                it('should trigger after playing an air card', function () {
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect('isawa-uona');
                });

                describe('When the reaction is triggered', function () {
                    beforeEach(function () {
                        this.player2.clickCard(this.uona);
                    });

                    it('should allow selecting a non-unique character', function () {
                        expect(this.player2).toHavePrompt('Choose a character');
                        expect(this.player2).toBeAbleToSelect(this.outrider);
                    });

                    it('should not allow selecting a unique character', function () {
                        expect(this.player2).not.toBeAbleToSelect(this.juro);
                    });

                    describe('if a legal character is selected', function () {
                        beforeEach(function () {
                            this.player2.clickCard(this.outrider);
                        });

                        it('should bow that character', function () {
                            expect(this.outrider.bowed).toBe(true);
                        });
                    });
                });
            });
        });
    });
});
