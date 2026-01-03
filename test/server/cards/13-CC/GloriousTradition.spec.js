describe('Glorious Tradition', function () {
    describe("Glorious Tradition's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['glorious-tradition', 'charette', 'gub']
                },
                player2: {
                    inPlay: ['lamindra', 'krump', 'umbra']
                }
            });
        });

        it('should exalt each enemy flank creature', function () {
            this.player1.useAction(this.gloriousTradition);
            expect(this.lamindra.tokens.amber).toBe(1);
            expect(this.umbra.tokens.amber).toBe(1);
            expect(this.krump.tokens.amber).toBeUndefined();
            expect(this.charette.tokens.amber).toBeUndefined();
            expect(this.gub.tokens.amber).toBeUndefined();
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
