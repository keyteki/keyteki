describe('Circle of Power', function () {
    describe("Circle of Power's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['circle-of-power', 'fuzzy-gruen', 'eunoia', 'charette'],
                    hand: ['witch-of-the-eye']
                },
                player2: {
                    inPlay: ['lamindra', 'tantadlin']
                }
            });
        });

        it('should make friendly Untamed creatures have 5 power', function () {
            expect(this.fuzzyGruen.power).toBe(5);
            expect(this.eunoia.power).toBe(5);
            expect(this.charette.power).toBe(4);
            expect(this.lamindra.power).toBe(1);
            expect(this.tantadlin.power).toBe(9);
        });

        it('should affect newly played Untamed creatures', function () {
            this.player1.play(this.witchOfTheEye);
            expect(this.witchOfTheEye.power).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
