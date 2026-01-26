describe("The Spirit's Way", function () {
    describe("The Spirit's Way's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['the-spirit-s-way'],
                    inPlay: ['mother-northelle', 'commander-remiel', 'francus']
                },
                player2: {
                    inPlay: ['lamindra', 'faygin', 'dodger']
                }
            });
        });

        it('should destroy all creatures with power 3 or higher', function () {
            this.player1.play(this.theSpiritSWay);
            expect(this.motherNorthelle.location).toBe('play area');
            expect(this.commanderRemiel.location).toBe('discard');
            expect(this.francus.location).toBe('discard');
            expect(this.lamindra.location).toBe('play area');
            expect(this.faygin.location).toBe('discard');
            expect(this.dodger.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
