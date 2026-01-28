describe('novu-dynamo', function () {
    describe("Novu-Dynamo's constant ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['snufflegator', 'library-access'],
                    hand: ['eyegor', 'anger', 'eureka'],
                    inPlay: ['novu-dynamo'],
                    amber: 0
                },
                player2: {
                    inPlay: ['helper-bot'],
                    hand: ['earthbind']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
        });

        describe('and the ability is triggered', function () {
            it('selects a logos card from hand or archives', function () {
                expect(this.player1).toBeAbleToSelect(this.eyegor);
                expect(this.player1).toBeAbleToSelect(this.libraryAccess);
                expect(this.player1).toBeAbleToSelect(this.novuDynamo);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.anger);
            });

            describe('discard from hand', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.eyegor);
                    this.player1.clickPrompt('logos');
                    this.player1.clickPrompt('no');
                });

                it('and gain amber', function () {
                    expect(this.eyegor.location).toBe('discard');
                    expect(this.novuDynamo.location).toBe('play area');
                    expect(this.player1.amber).toBe(1);
                });

                it('and allow playing an alpha card', function () {
                    this.player1.play(this.eureka);
                    expect(this.player1.amber).toBe(4);
                });

                describe('Trigger again', function () {
                    beforeEach(function () {
                        this.player1.endTurn();
                        this.player2.clickPrompt('untamed');
                        this.player2.playUpgrade(this.earthbind, this.novuDynamo);
                        this.player2.endTurn();
                    });

                    it('selects a logos card from hand or archives', function () {
                        expect(this.player1).not.toBeAbleToSelect(this.eyegor);
                        expect(this.player1).toBeAbleToSelect(this.libraryAccess);
                        expect(this.player1).toBeAbleToSelect(this.eureka);
                        expect(this.player1).toBeAbleToSelect(this.novuDynamo);
                        expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                        expect(this.player1).not.toBeAbleToSelect(this.anger);
                    });

                    describe('discard from archive', function () {
                        beforeEach(function () {
                            this.player1.clickCard(this.libraryAccess);
                            this.player1.clickPrompt('logos');
                            this.player1.clickPrompt('No');
                        });

                        it('gives amber', function () {
                            expect(this.libraryAccess.location).toBe('discard');
                            expect(this.novuDynamo.location).toBe('play area');
                            expect(this.player1.amber).toBe(2);
                        });

                        it('should not allow using Novu Dynamo due to Earthbind', function () {
                            this.player1.clickCard(this.novuDynamo);
                            expect(this.player1).not.toHavePromptButton('Reap with this creature');
                        });
                    });

                    describe('discard from hand', function () {
                        beforeEach(function () {
                            this.player1.clickCard(this.eureka);
                            this.player1.clickPrompt('logos');
                            this.player1.clickPrompt('No');
                        });

                        it('gives amber', function () {
                            expect(this.eureka.location).toBe('discard');
                            expect(this.novuDynamo.location).toBe('play area');
                            expect(this.player1.amber).toBe(2);
                        });

                        it('should allow using Novu Dynamo due to Earthbind', function () {
                            this.player1.clickCard(this.novuDynamo);
                            expect(this.player1).toHavePromptButton('Reap with this creature');
                        });
                    });
                });
            });

            describe('discard from archive', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.libraryAccess);
                });

                it('gives amber', function () {
                    expect(this.libraryAccess.location).toBe('discard');
                    expect(this.novuDynamo.location).toBe('play area');
                    expect(this.player1.amber).toBe(1);
                });
            });

            describe('destroy Novu Dynamo', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.novuDynamo);
                });

                it('should destroy Novu Dynamo end effect', function () {
                    expect(this.libraryAccess.location).toBe('archives');
                    expect(this.eyegor.location).toBe('hand');
                    expect(this.player1.amber).toBe(0);
                    expect(this.novuDynamo.location).toBe('discard');
                });
            });
        });

        describe('and the ability is triggered and AP can forge key', function () {
            beforeEach(function () {
                this.player1.player.amber = 5;
            });

            it('selects a logos card from hand or archives', function () {
                expect(this.player1).toBeAbleToSelect(this.eyegor);
                expect(this.player1).toBeAbleToSelect(this.libraryAccess);
                expect(this.player1).toBeAbleToSelect(this.novuDynamo);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.anger);
            });

            describe('discard from hand', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.eyegor);
                });

                it('and gain amber and be able to forge', function () {
                    expect(this.eyegor.location).toBe('discard');
                    expect(this.novuDynamo.location).toBe('play area');
                    expect(this.player1.amber).toBe(6);
                    expect(this.player1).toHavePrompt('Which key would you like to forge?');
                });
            });
        });
    });

    describe('Novu Dynamo with destruction prevention', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['novu-dynamo'],
                    hand: ['ghostform']
                },
                player2: {}
            });
            this.player1.makeMaverick(this.ghostform, 'logos');
        });

        it('should not destroy Novu Dynamo due to invulnerable', function () {
            this.player1.playUpgrade(this.ghostform, this.novuDynamo);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickCard(this.novuDynamo);
            expect(this.novuDynamo.location).toBe('play area');
            expect(this.novuDynamo.upgrades).toContain(this.ghostform);
            expect(this.player1.amber).toBe(1);
            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not destroy Novu Dynamo due to ward', function () {
            this.novuDynamo.ward();
            expect(this.player1.amber).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickCard(this.novuDynamo);
            expect(this.novuDynamo.location).toBe('play area');
            expect(this.player1.amber).toBe(0);
            this.player1.clickPrompt('logos');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
