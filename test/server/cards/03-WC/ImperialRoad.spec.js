describe('Imperial Road', function () {
    describe("Imperial Road's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['imperial-road'],
                    hand: ['flaxia', 'tantadlin', 'troll']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should not prompt for creature', function () {
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });

    describe("Imperial Road's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['imperial-road'],
                    hand: ['flaxia', 'tantadlin', 'troll', 'grimlocus-dux', 'tribune-pompitus']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump']
                }
            });
        });

        it("should be able to select Saurian creature to play and fizzle when there's none", function () {
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.grimlocusDux);
            expect(this.player1).toBeAbleToSelect(this.tribunePompitus);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.grimlocusDux);
            expect(this.grimlocusDux.location).toBe('play area');
            expect(this.grimlocusDux.stunned).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.grimlocusDux);
            expect(this.player1).toBeAbleToSelect(this.tribunePompitus);
            this.player1.clickCard(this.tribunePompitus);
            this.player1.clickPrompt('left');
            expect(this.tribunePompitus.location).toBe('play area');
            expect(this.tribunePompitus.stunned).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.imperialRoad.exhausted).toBe(true);
        });
    });
});
