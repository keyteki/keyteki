describe('Halacor', function () {
    describe("Halacor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['halacor', 'troll', 'sequis']
                },
                player2: {}
            });
        });

        it('should give only flank creatures skirmish', function () {
            expect(this.halacor.getKeywordValue('skirmish')).toBe(1);
            expect(this.troll.getKeywordValue('skirmish')).toBe(0);
            expect(this.sequis.getKeywordValue('skirmish')).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
