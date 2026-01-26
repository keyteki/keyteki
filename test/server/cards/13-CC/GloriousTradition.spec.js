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
            expect(this.lamindra.amber).toBe(1);
            expect(this.umbra.amber).toBe(1);
            expect(this.krump.amber).toBe(0);
            expect(this.charette.amber).toBe(0);
            expect(this.gub.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
