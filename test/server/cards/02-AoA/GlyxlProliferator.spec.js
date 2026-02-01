describe('Glyxl Proliferator', function () {
    describe("Glyxl Proliferator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['glyxl-proliferator'],
                    discard: ['zorg', 'tunk']
                },
                player2: {}
            });
        });

        it('should archive a Mars card from discard pile on reap when on flank', function () {
            this.player1.reap(this.glyxlProliferator);

            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.tunk);
            this.player1.clickCard(this.zorg);

            expect(this.zorg.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive when not on flank', function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zorg', 'glyxl-proliferator', 'john-smyth'],
                    discard: ['crystal-hive']
                },
                player2: {}
            });

            this.player1.reap(this.glyxlProliferator);

            expect(this.crystalHive.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
