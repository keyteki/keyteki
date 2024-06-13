describe('Oubliette', function () {
    describe("Oubliette's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['urchin', 'silvertooth', 'noddy-the-thief', 'troll'],
                    hand: ['oubliette']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus', 'brend-the-fanatic']
                }
            });
        });

        it('should purge friendly shadow creatures and steal amber', function () {
            this.player1.play(this.oubliette);

            expect(this.player1).toBeAbleToSelect(this.brendTheFanatic);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.noddyTheThief);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
        });
    });
});
