describe('Crewman Jörg', function () {
    describe("Crewman Jörg's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['troll', 'crewman-jörg'],
                    hand: ['medic-ingram']
                },
                player2: {
                    amber: 4,
                    inPlay: ['batdrone', 'bot-bookton']
                }
            });
        });

        it('should steal 1A if it has no star alliance neighbors', function () {
            this.player1.useAction(this.crewmanJörg);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should not steal 1A if it has at least one star alliance neighbor', function () {
            this.player1.play(this.medicIngram);
            this.player1.clickCard(this.medicIngram);
            this.player1.useAction(this.crewmanJörg);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(4);
        });
    });
});
