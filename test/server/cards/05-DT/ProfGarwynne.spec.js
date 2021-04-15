describe('Prof. Garwynne', function () {
    describe("Prof. Garwynne's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['way-of-the-bear', 'niffle-ape'],
                    inPlay: ['prof-garwynne']
                },
                player2: {
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should return a card from archives to hand when it reaps', function () {
            this.player1.reap(this.profGarwynne);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
        });
    });
});
