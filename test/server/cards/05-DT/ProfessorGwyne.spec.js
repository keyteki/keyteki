describe('ProfessorGwyne', function () {
    describe("ProfessorGwyne's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['way-of-the-bear', 'niffle-ape'],
                    inPlay: ['professor-gwyne']
                },
                player2: {
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should return a card from archives to hand when it reaps', function () {
            this.player1.reap(this.professorGwyne);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.niffleApe);
            expect(this.niffleApe.location).toBe('hand');
        });
    });
});
