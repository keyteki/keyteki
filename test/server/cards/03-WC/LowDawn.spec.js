describe('Low Dawn', function () {
    describe("Low Dawn's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    discard: ['dust-pixie', 'kangaphant', 'snufflegator', 'duskwitch'],
                    hand: ['low-dawn', 'dew-faerie']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'grabber-jammer']
                }
            });
        });
        it('should give 2A if there are 3 or more untamed creatures in discard', function () {
            this.player1.play(this.lowDawn);
            expect(this.player1.amber).toBe(3);
            expect(this.dustPixie.location).toBe('deck');
            expect(this.kangaphant.location).toBe('deck');
            expect(this.snufflegator.location).toBe('deck');
            expect(this.duskwitch.location).toBe('deck');
        });
        it('should give 0A if there are 2 or less untamed creatures in discard', function () {
            this.player1.moveCard(this.dustPixie, 'purged');
            this.player1.moveCard(this.kangaphant, 'purged');
            this.player1.play(this.lowDawn);
            expect(this.player1.amber).toBe(1);
            expect(this.snufflegator.location).toBe('deck');
            expect(this.duskwitch.location).toBe('deck');
        });
    });
});
