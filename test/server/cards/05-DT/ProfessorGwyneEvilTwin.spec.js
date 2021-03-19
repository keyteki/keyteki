describe('ProfessorGwyne EvilTwin', function () {
    describe("ProfessorGwyneEvilTwin's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['way-of-the-bear', 'niffle-ape'],
                    inPlay: ['professor-gwyne-evil-twin']
                },
                player2: {
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should return a card from archives to hand when it fights', function () {
            this.player1.fightWith(this.professorGwyneEvilTwin, this.badPenny);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
        });
    });
});
