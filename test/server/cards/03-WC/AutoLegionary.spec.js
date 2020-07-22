describe('Auto-Legionary', function () {
    describe('when action ability is triggered', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['legatus-raptor', 'mooncurser', 'tantadlin', 'auto-legionary']
                },
                player2: {
                    hand: ['troll', 'mimic-gel']
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

            describe('when action ability is a second time triggered', function () {
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

            describe('when interacting with Mimic Gel', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                    this.player2.play(this.mimicGel);
                    expect(this.player2).toBeAbleToSelect(this.autoLegionary);
                    expect(this.player2).toBeAbleToSelect(this.tantadlin);
                    this.player2.clickCard(this.autoLegionary);
                });

                it('should have power 5 and armor 0', function () {
                    expect(this.mimicGel.location).toBe('play area');
                    expect(this.mimicGel.power).toBe(5);
                    expect(this.mimicGel.armor).toBe(0);
                });
            });
        });
    });
});
