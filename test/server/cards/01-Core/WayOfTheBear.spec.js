describe('Way of the Bear', function () {
    describe("Way of the Bear's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['way-of-the-bear'],
                    inPlay: ['dust-pixie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should grant assault 2 to attached friendly creature', function () {
            this.player1.playUpgrade(this.wayOfTheBear, this.dustPixie);
            expect(this.dustPixie.getKeywordValue('assault')).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should grant assault 2 to attached enemy creature', function () {
            this.player1.playUpgrade(this.wayOfTheBear, this.troll);
            expect(this.troll.getKeywordValue('assault')).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
