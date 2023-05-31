describe('Batariel of the Grey', function () {
    describe("Batariel of the Grey's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    token: 'disciple',
                    inPlay: ['disciple:troll', 'disciple:holdfast', 'batariel-of-the-grey', 'troll']
                },
                player2: {
                    token: 'disciple',
                    inPlay: ['disciple:quixxle-stone']
                }
            });

            this.disciple1 = this.player1.player.cardsInPlay[0];
            this.disciple2 = this.player1.player.cardsInPlay[1];
            this.disciple3 = this.player2.player.cardsInPlay[0];
        });

        it('should ready Disciples after reap', function () {
            this.disciple1.exhausted = true;
            this.disciple2.exhausted = true;
            this.disciple3.exhausted = true;
            this.troll.exhausted = true;
            this.player1.reap(this.batarielOfTheGrey);
            expect(this.disciple1.exhausted).toBe(false);
            expect(this.disciple2.exhausted).toBe(false);
            expect(this.disciple3.exhausted).toBe(false);
            expect(this.troll.exhausted).toBe(true);
        });
    });
});
