describe('Gub', function () {
    describe("Gub's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['gub'],
                    hand: ['zorg', 'mindwarper']
                },
                player2: {}
            });
        });

        it('should get +5 power and taunt when not on flank', function () {
            expect(this.gub.power).toBe(1);
            expect(this.gub.getKeywordValue('taunt')).toBe(0);

            this.player1.playCreature(this.zorg, true);
            expect(this.gub.power).toBe(1);
            expect(this.gub.getKeywordValue('taunt')).toBe(0);

            this.player1.playCreature(this.mindwarper);
            expect(this.gub.power).toBe(6);
            expect(this.gub.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
