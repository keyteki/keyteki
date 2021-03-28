describe('Armsmaster Molina', function () {
    describe("Armsmaster Molina's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['lamindra'],
                    inPlay: ['umbra', 'redlock', 'bad-penny']
                },
                player2: {
                    inPlay: ['dust-pixie', 'armsmaster-molina', 'po-s-pixies']
                }
            });
        });

        it('should give its neighbors hazardous:3', function () {
            expect(this.dustPixie.getKeywordValue('hazardous')).toBe(3);
            expect(this.poSPixies.getKeywordValue('hazardous')).toBe(3);
        });
    });
});
