describe('Glyxl Proliferator', function () {
    describe("Glyxl Proliferator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zorg', 'glyxl-proliferator'],
                    hand: ['john-smyth'],
                    discard: ['yxilx-dominator', 'troll']
                },
                player2: {}
            });
        });

        it('should archive a Mars card from discard pile on reap when on flank', function () {
            this.player1.reap(this.glyxlProliferator);
            expect(this.player1).toBeAbleToSelect(this.yxilxDominator);
            expect(this.player1).not.toBeAbleToSelect(this.zorg);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.yxilxDominator);
            expect(this.yxilxDominator.location).toBe('archives');
            expect(this.troll.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive when not on flank', function () {
            this.player1.playCreature(this.johnSmyth);
            this.player1.reap(this.glyxlProliferator);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
