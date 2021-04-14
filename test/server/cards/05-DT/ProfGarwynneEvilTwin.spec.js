describe('Prof. Garwynne Evil Twin', function () {
    describe("Prof. Garwynne Evil Twin's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['way-of-the-bear', 'niffle-ape'],
                    inPlay: ['prof-garwynne-evil-twin']
                },
                player2: {
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should return a card from archives to hand when it fights', function () {
            this.player1.fightWith(this.profGarwynneEvilTwin, this.badPenny);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
        });
    });
});
