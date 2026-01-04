describe('Skippy Timehog', function () {
    describe("Skippy Timehog's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['skippy-timehog'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 1,
                    hand: ['dust-pixie', 'full-moon', 'cauldron', 'camouflage', 'earthbind'],
                    inPlay: ['hunting-witch', 'witch-of-the-eye']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.skippyTimehog);
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
            });

            it('should prevent opponent from using any cards', function () {
                this.player2.clickCard(this.huntingWitch);
                expect(this.player2).not.toHavePromptButton('Reap with this creature');
                expect(this.player2).not.toHavePromptButton('Fight with this creature');
                this.player2.clickCard(this.witchOfTheEye);
                expect(this.player2).not.toHavePromptButton('Reap with this creature');
                expect(this.player2).not.toHavePromptButton('Fight with this creature');

                expect(this.player2).isReadyToTakeAction();
            });

            it('should allow opponent to play and discard cards normally', function () {
                // Should be able to play creatures
                this.player2.playCreature(this.dustPixie);
                expect(this.dustPixie.location).toBe('play area');

                // Should be able to play upgrades
                this.player2.playUpgrade(this.camouflage, this.dustPixie);
                expect(this.camouflage.location).toBe('play area');

                // Should be able to play actions
                this.player2.play(this.fullMoon);
                expect(this.fullMoon.location).toBe('discard');

                // Should be able to play artifacts
                this.player2.play(this.cauldron);
                expect(this.cauldron.location).toBe('play area');

                // Should be able to discard cards
                this.player2.clickCard(this.earthbind);
                this.player2.clickPrompt('Discard this card');
                expect(this.earthbind.location).toBe('discard');

                expect(this.player2).isReadyToTakeAction();
            });

            it('should only last for one turn', function () {
                this.player2.endTurn();
                this.player1.clickPrompt('logos');
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.clickCard(this.huntingWitch);
                expect(this.player2).toHavePromptButton('Reap with this creature');
                expect(this.player2).toHavePromptButton('Fight with this creature');
            });
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'logos',
                    hand: ['skippy-timehog'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 1,
                    hand: ['dust-pixie', 'oubliette'],
                    inPlay: ['hunting-witch']
                }
            });
            this.tachyonManifold.maverick = 'logos';
            this.tachyonManifold.printedHouse = 'logos';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.skippyTimehog);
            this.player1.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.clickCard(this.huntingWitch);
            expect(this.player2).not.toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
