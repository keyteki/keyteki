describe('CelestialGorm', function () {
    describe("CelestialGorm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['celestial-gorm', 'round-table']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'irestaff']
                }
            });
        });

        it('should move friendly and opponent artifacts to hands and destroy itself', function () {
            this.player1.clickCard(this.celestialGorm);
            this.player1.clickPrompt("Use this card's Omni ability");

            expect(this.celestialGorm.location).toBe('discard');
            expect(this.roundTable.location).toBe('hand');
            expect(this.irestaff.location).toBe('hand');

            this.player1.endTurn();
        });

        it('should destroy itself if there is no artifiacts in play', function () {
            this.player1.clickCard(this.celestialGorm);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.celestialGorm.location).toBe('discard');

            this.player1.endTurn();
        });
    });
});
