describe('Auto-Legionary', function () {
    describe('when action ability is triggered', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['legatus-raptor', 'mooncurser', 'tantadlin', 'auto-legionary']
                },
                player2: {
                    hand: ['troll', 'groggins', 'groggins', 'groggins', 'groggins', 'groggins']
                }
            });

            this.player1.useAction(this.autoLegionary);
        });

        it('should prompt which flank to put the artifact on', function () {
            expect(this.player1).toHavePromptButton('Left');
            expect(this.player1).toHavePromptButton('Right');
        });

        describe('when a flank is selected', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Left');
            });

            it('should consider the artifact to be a creature', function () {
                expect(this.autoLegionary.type).toBe('creature');
            });

            it('should give the artifact 5 power', function () {
                expect(this.autoLegionary.power).toBe(5);
            });

            it('should be used as it belonged to the active house', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.reap(this.autoLegionary);
                expect(this.player1.amber).toBe(1);
            });

            it('should not allow other saurian cards to reap', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.clickCard(this.legatusRaptor);
                expect(this.player1).not.toHavePromptButton('Reap with this creature');
            });

            describe('when action ability is triggered as a creature', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('brobnar');
                    this.player2.endTurn();
                    this.player1.clickPrompt('untamed');
                    this.player1.useAction(this.autoLegionary);
                });

                it('should prompt which flank to put the artifact on', function () {
                    expect(this.player1).toHavePromptButton('Left');
                    expect(this.player1).toHavePromptButton('Right');
                });

                describe('when a flank is selected', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('Left');
                    });

                    it('should consider the artifact to be a creature', function () {
                        expect(this.autoLegionary.type).toBe('creature');
                    });

                    it('should give the artifact 5 power', function () {
                        expect(this.autoLegionary.power).toBe(5);
                    });
                });
            });
        });
    });

    describe('when action ability is triggered by nexus', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['nexus']
                },
                player2: {
                    inPlay: ['legatus-raptor', 'mooncurser', 'tantadlin', 'auto-legionary']
                }
            });
        });

        it('should exhaust and not move to battleline', function () {
            this.player1.reap(this.nexus);
            this.player1.clickCard(this.autoLegionary);
            expect(this.autoLegionary.exhausted).toBe(true);
            this.player1.endTurn();
        });
    });

    describe('when action ability is triggered by nexus', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['legatus-raptor', 'mooncurser', 'tantadlin', 'auto-legionary']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should not be usable in any house after destroyed and played again', function () {
            this.player1.useAction(this.autoLegionary);
            this.player1.clickPrompt('Left');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.autoLegionary);
            expect(this.autoLegionary.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('saurian');
            this.player1.moveCard(this.autoLegionary, 'hand');
            this.player1.play(this.autoLegionary);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.clickCard(this.autoLegionary);
            this.player1.endTurn();
        });
    });
});
