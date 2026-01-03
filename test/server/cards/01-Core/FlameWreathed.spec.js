describe('Flame-Wreathed', function () {
    describe("Flame-Wreathed's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['ember-imp'],
                    hand: ['flame-wreathed']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should give attached creature +2 power and hazardous 2', function () {
            this.player1.playUpgrade(this.flameWreathed, this.emberImp);
            expect(this.emberImp.power).toBe(4);
            expect(this.emberImp.getKeywordValue('hazardous')).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
