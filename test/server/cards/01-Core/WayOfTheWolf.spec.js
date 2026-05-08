describe('Way of the Wolf', function () {
    describe("Way of the Wolf's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['way-of-the-wolf'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should grant skirmish to attached friednly creature', function () {
            this.player1.playUpgrade(this.wayOfTheWolf, this.dustPixie);
            expect(this.dustPixie.getKeywordValue('skirmish')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should grant skirmish to attached enemy creature', function () {
            this.player1.playUpgrade(this.wayOfTheWolf, this.troll);
            expect(this.troll.getKeywordValue('skirmish')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
