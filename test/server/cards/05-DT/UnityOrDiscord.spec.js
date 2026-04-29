describe('UnityOrDiscord', function () {
    describe('with no creatures in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    hand: [
                        'unity-or-discord',
                        'access-denied',
                        'disruption-field',
                        'com-officer-kirby'
                    ]
                },
                player2: {
                    amber: 2,
                    hand: ['bad-penny', 'mole']
                }
            });
            this.player1.play(this.unityOrDiscord);
        });

        it('should not prompt for choice', function () {
            expect(this.player1).toHavePromptButton('Use a non-Star Alliance creature');
            expect(this.player1).toHavePromptButton('Return creatures and upgrades');
        });

        describe('when use non-SA is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Use a non-Star Alliance creature');
            });

            it('should not do anything', function () {
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when Return creatures is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Return creatures and upgrades');
            });

            it('should click Done and not do anything', function () {
                this.player1.clickPrompt('Done');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe("UnityOrDiscord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska', 'lamindra'],
                    hand: [
                        'unity-or-discord',
                        'access-denied',
                        'disruption-field',
                        'com-officer-kirby',
                        'hypnobeam'
                    ]
                },
                player2: {
                    amber: 2,
                    inPlay: ['bad-penny'],
                    hand: ['mole']
                }
            });

            this.player1.playUpgrade(this.accessDenied, this.rocketeerTryska);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');

            this.player2.playUpgrade(this.mole, this.lamindra);
            this.player2.endTurn();
            this.player1.clickPrompt('staralliance');
        });

        describe('when there is no non-SA friendly creature', function () {
            beforeEach(function () {
                this.player1.moveCard(this.lamindra, 'discard');
                this.player1.play(this.unityOrDiscord);
            });

            it('should prompt for choices', function () {
                expect(this.player1).toHavePromptButton('Use a non-Star Alliance creature');
                expect(this.player1).toHavePromptButton('Return creatures and upgrades');
            });

            describe('when use non-SA is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Use a non-Star Alliance creature');
                });

                it('should not do anything', function () {
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });

        describe('when there are non-SA friendly creature', function () {
            beforeEach(function () {
                this.player1.play(this.unityOrDiscord);
            });

            describe('when Return creatures is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Return creatures and upgrades');
                });

                it('should be able to select friendly creatures', function () {
                    expect(this.player1).toBeAbleToSelect(this.lamindra);
                    expect(this.player1).toBeAbleToSelect(this.rocketeerTryska);
                    expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                });

                it('should be able to select no creature', function () {
                    this.player1.clickPrompt('Done');
                    expect(this.lamindra.location).toBe('play area');
                    expect(this.rocketeerTryska.location).toBe('play area');
                    expect(this.badPenny.location).toBe('play area');
                    expect(this.player1).isReadyToTakeAction();
                });

                it('should be able to select one creature', function () {
                    this.player1.clickCard(this.lamindra);
                    this.player1.clickPrompt('Done');
                    expect(this.player1).isReadyToTakeAction();
                    expect(this.lamindra.location).toBe('hand');
                    expect(this.mole.location).toBe('hand');
                    expect(this.rocketeerTryska.location).toBe('play area');
                });

                it('should be able to select two creatures', function () {
                    this.player1.clickCard(this.lamindra);
                    this.player1.clickCard(this.rocketeerTryska);
                    this.player1.clickPrompt('Done');
                    expect(this.player1).isReadyToTakeAction();
                    expect(this.lamindra.location).toBe('hand');
                    expect(this.accessDenied.location).toBe('hand');
                    expect(this.rocketeerTryska.location).toBe('hand');
                    expect(this.mole.location).toBe('hand');
                });
            });

            describe('Use a non-Star Alliance creature', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Use a non-Star Alliance creature');
                });

                it('should be able to select non-SA friendly creatures', function () {
                    expect(this.player1).toBeAbleToSelect(this.lamindra);
                    expect(this.player1).not.toBeAbleToSelect(this.rocketeerTryska);
                    expect(this.player1).not.toBeAbleToSelect(this.badPenny);
                });

                it('should be able to use the creature', function () {
                    this.player1.clickCard(this.lamindra);
                    this.player1.clickPrompt('Reap with this creature');
                });
            });
        });
    });
});
