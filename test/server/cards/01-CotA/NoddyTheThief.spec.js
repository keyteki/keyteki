describe('Noddy the Thief', function () {
    describe("Noddy the Thief's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['noddy-the-thief']
                },
                player2: {
                    amber: 5,
                    inPlay: ['nexus']
                }
            });
        });

        it('should purge friendly shadow creatures and steal amber', function () {
            this.player1.clickCard(this.noddyTheThief);
            this.player1.clickPrompt("Use this card's Action ability");
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
