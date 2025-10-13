describe('Screeyan', function () {
    describe("Screeyan's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    inPlay: ['screeyan']
                },
                player2: {
                    amber: 3,
                    discard: ['umbra', 'dust-pixie', 'troll']
                }
            });
        });

        it('should discard top of opponent deck at end of turn', function () {
            this.player2.moveCard(this.umbra, 'deck');
            this.player1.endTurn();
            expect(this.umbra.location).toBe('discard');
            expect(this.player2).not.toHavePromptButton('shadows');
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('brobnar');
        });

        it('should block house enhancements too', function () {
            this.umbra.enhancements = ['untamed'];
            this.player2.moveCard(this.umbra, 'deck');
            this.player1.endTurn();
            expect(this.umbra.location).toBe('discard');
            expect(this.player2).not.toHavePromptButton('shadows');
            expect(this.player2).not.toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('brobnar');
        });

        it('should do nothing with an empty deck', function () {
            this.player2.player.deck = [];
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('shadows');
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('brobnar');
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'ekwidon',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'screeyan']
                },
                player2: {
                    amber: 0,
                    inPlay: [],
                    hand: ['umbra', 'troll']
                }
            });
            this.tachyonManifold.maverick = 'ekwidon';
            this.tachyonManifold.printedHouse = 'ekwidon';
            this.player1.useAction(this.tachyonManifold);
            this.player2.moveCard(this.umbra, 'deck');
            this.player2.moveCard(this.troll, 'deck');
        });

        it("should affect opponent's next turn", function () {
            this.player1.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).not.toHavePromptButton('shadows');
            expect(this.player2).not.toHavePromptButton('brobnar');
            this.player2.clickPrompt('untamed');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
