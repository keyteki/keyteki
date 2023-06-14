describe('Knightapult', function () {
    describe('action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    inPlay: ['chelonia', 'flaxia', 'knightapult'],
                    hand: ['holdfast', 'berinon']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });

            this.player1.useAction(this.knightapult);
        });

        describe('should cause the next creature played', function () {
            beforeEach(function () {
                this.player1.clickCard(this.holdfast);
                this.player1.clickPrompt('Play this creature');
            });

            it('to be deployable', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).toHavePromptButton('Deploy Left');
                expect(this.player1).toHavePromptButton('Deploy Right');
            });

            it('to be ready', function () {
                this.player1.clickPrompt('Deploy Left');
                this.player1.clickCard(this.flaxia);

                expect(this.holdfast.exhausted).toBe(false);
            });
        });
        describe('should cause the 2nd next creature played', function () {
            beforeEach(function () {
                this.player1.play(this.holdfast);
                this.player1.clickCard(this.berinon);
                this.player1.clickPrompt('Play this creature');
            });

            it('not to be deployable', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).not.toHavePromptButton('Deploy Left');
                expect(this.player1).not.toHavePromptButton('Deploy Right');
            });

            it('not to be ready', function () {
                this.player1.clickPrompt('Left');

                expect(this.berinon.exhausted).toBe(true);
            });
        });
    });

    describe("action with Gebuk's replacement", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    inPlay: ['chelonia', 'gebuk', 'flaxia', 'knightapult', 'sequis'],
                    hand: ['holdfast', 'berinon', 'smite']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });
            this.player1.moveCard(this.sequis, 'deck');
            this.player1.useAction(this.knightapult);
        });
        describe('when Gebuk dies,', function () {
            beforeEach(function () {
                this.player1.play(this.smite);
                this.player1.clickCard(this.gebuk);
                this.player1.clickCard(this.troll);
            });

            it('should place the replacement where Gebuk was, with no prompt', function () {
                expect(this.player1.inPlay[1]).toBe(this.sequis);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                expect(this.player1).not.toHavePrompt(
                    'Which flank do you want to place this creature on?'
                );
            });

            it('the replacement creature should be ready', function () {
                expect(this.sequis.exhausted).toBe(false);
            });
        });
    });

    describe('action with token creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    amber: 3,
                    token: 'cleric',
                    inPlay: ['chelonia', 'flaxia', 'berinon', 'knightapult'],
                    hand: ['holdfast', 'muster'],
                    deck: ['sequis', 'musthic-murmook']
                },
                player2: {
                    inPlay: ['troll', 'gub']
                }
            });
            this.player1.useAction(this.knightapult);
        });

        describe('should cause the next token', function () {
            beforeEach(function () {
                this.player1.play(this.muster);
            });

            it('to be deployable', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).toHavePromptButton('Deploy Left');
                expect(this.player1).toHavePromptButton('Deploy Right');
            });

            it('to be ready', function () {
                this.player1.clickPrompt('Left');
                this.player1.clickCard(this.flaxia);

                let tokenCreature = this.player1.inPlay[0];
                expect(tokenCreature.isToken()).toBe(true);
                expect(tokenCreature.exhausted).toBe(false);
            });
        });

        describe('should cause the 2nd next token', function () {
            beforeEach(function () {
                this.player1.play(this.muster);
                this.player1.clickPrompt('Left');
                this.player1.moveCard(this.muster, 'hand');
                this.player1.play(this.muster);
            });

            it('not to be deployable', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).not.toHavePromptButton('Deploy Left');
                expect(this.player1).not.toHavePromptButton('Deploy Right');
            });

            it('not to be ready', function () {
                this.player1.clickPrompt('Left');

                let tokenCreature = this.player1.inPlay[0];
                expect(tokenCreature.isToken()).toBe(true);
                expect(tokenCreature.exhausted).toBe(true);
            });
        });
    });

    describe('action, causing opponent to play', function () {
        describe('a creature with Trojan Sauropod,', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        amber: 3,
                        inPlay: ['chelonia', 'flaxia', 'knightapult'],
                        hand: ['holdfast', 'berinon']
                    },
                    player2: {
                        inPlay: ['senator-shrix', 'rhetor-gallim'],
                        hand: [
                            'trojan-sauropod',
                            'gub',
                            'anger',
                            'anger',
                            'anger',
                            'anger',
                            'anger'
                        ]
                    }
                });

                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.play(this.trojanSauropod);
                this.player2.endTurn();
                this.player1.clickPrompt('sanctum');
                // ready sauropod
                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.endTurn();
                this.player1.clickPrompt('sanctum');

                this.player1.useAction(this.knightapult);
                this.player1.useAction(this.trojanSauropod, true);
            });

            it('should not give deploy to incoming enemy creatures', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).not.toHavePromptButton('Deploy Left');
                expect(this.player1).not.toHavePromptButton('Deploy Right');
            });

            describe('should still give next friendly creature', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Left'); // gub

                    this.player1.clickCard(this.berinon);
                    this.player1.clickPrompt('Play this creature');
                });

                it('deploy', function () {
                    expect(this.player1).toHavePromptButton('Left');
                    expect(this.player1).toHavePromptButton('Right');
                    expect(this.player1).toHavePromptButton('Deploy Left');
                    expect(this.player1).toHavePromptButton('Deploy Right');
                });

                it('ready', function () {
                    this.player1.clickPrompt('Left');

                    expect(this.berinon.exhausted).toBe(false);
                });
            });
        });

        describe('a token creature with Kamalani,', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'sanctum',
                        amber: 3,
                        inPlay: ['chelonia', 'flaxia', 'knightapult'],
                        hand: ['holdfast', 'hammer-gram']
                    },
                    player2: {
                        token: 'warrior',
                        inPlay: ['troll', 'gub', 'kamalani'],
                        deck: ['anger', 'alaka']
                    }
                });

                this.kamalani.tokens.damage = 2;
                this.player1.useAction(this.knightapult);
                this.player1.play(this.hammerGram);
                this.player1.clickCard(this.kamalani);
            });

            it('should not give the new tokens deploy', function () {
                expect(this.player1).toHavePromptButton('Left');
                expect(this.player1).toHavePromptButton('Right');
                expect(this.player1).not.toHavePromptButton('Deploy Left');
                expect(this.player1).not.toHavePromptButton('Deploy Right');
            });

            it('should not give the new tokens ready', function () {
                this.player1.clickPrompt('Left');
                this.player1.clickPrompt('Left');

                let alakaToken = this.player2.inPlay[0];
                expect(alakaToken.isToken()).toBe(true);
                expect(alakaToken.exhausted).toBe(true);
            });

            describe('should give the next friendly creature', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Left');
                    this.player1.clickPrompt('Left');

                    this.player1.clickCard(this.holdfast);
                    this.player1.clickPrompt('Play this creature');
                });

                it('deploy', function () {
                    expect(this.player1).toHavePromptButton('Left');
                    expect(this.player1).toHavePromptButton('Right');
                    expect(this.player1).toHavePromptButton('Deploy Left');
                    expect(this.player1).toHavePromptButton('Deploy Right');
                });

                it('ready', function () {
                    this.player1.clickPrompt('Left');

                    expect(this.holdfast.exhausted).toBe(false);
                });
            });
        });
    });
});
