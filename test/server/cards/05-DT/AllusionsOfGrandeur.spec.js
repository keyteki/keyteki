describe('Allusions of Grandeur', function () {
    describe("Allusions of Grandeur's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    hand: ['allusions-of-grandeur']
                },
                player2: {
                    inPlay: ['doc-bookton', 'pit-demon', 'troll']
                }
            });
        });

        it('should not gain extra amber if the opponent follows instructions', function () {
            this.player1.play(this.allusionsOfGrandeur);
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('brobnar');
            expect(this.player1).not.toHavePromptButton('mars');
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            expect(this.player1.amber).toBe(2);
        });

        it('should gain amber if the opponent does not follow instructions', function () {
            this.player1.play(this.allusionsOfGrandeur);
            this.player1.clickPrompt('logos');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player1.amber).toBe(5);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'unfathomable',
                    hand: ['allusions-of-grandeur'],
                    inPlay: ['tachyon-manifold']
                },
                player2: {
                    amber: 0,
                    inPlay: [],
                    hand: []
                }
            });
            this.tachyonManifold.maverick = 'unfathomable';
            this.tachyonManifold.printedHouse = 'unfathomable';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should affect opponent's next turn", function () {
            this.player1.play(this.allusionsOfGrandeur);
            this.player1.clickPrompt('sanctum');
            this.player1.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.player1.amber).toBe(4);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
