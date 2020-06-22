describe('Essence Scale', function () {
    describe('Action ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dodger', 'umbra', 'troll', 'essence-scale']
                },
                player2: {
                    inPlay: ['helper-bot']
                }
            });
            this.player1.useAction(this.essenceScale);
        });

        it('should be able to select all friendly creatures', function () {
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
        });

        describe('select a card to destroy that shares houses', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dodger);
            });

            it('selected card in discard and able to select card of the same house', function () {
                expect(this.dodger.location).toBe('discard');
                expect(this.player1).toBeAbleToSelect(this.umbra);
                expect(this.player1).not.toBeAbleToSelect(this.troll);
                expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            });
        });
        describe('select a card to destroy that shares no houses with other cards in play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.troll);
            });

            it('selected card in discard and able to select card of the same house', function () {
                expect(this.troll.location).toBe('discard');
                expect(this.player1).not.toBeAbleToSelect(this.umbra);
                expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            });
        });
    });
});
