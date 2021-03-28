describe('Magda the Rat', function () {
    describe("Magda the Rat's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['magda-the-rat']
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'bumpsy']
                }
            });
        });

        it('should steal when coming into play', function () {
            this.player2.amber = 1;
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
        });

        it("should allow opponent to steal when leaving play during controller's turn", function () {
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.fightWith(this.magdaTheRat, this.troll);
            expect(this.magdaTheRat.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });

        it("should allow opponent to steal when leaving play during opponent's turn", function () {
            this.player1.play(this.magdaTheRat);
            expect(this.player2.amber).toBe(1);
            expect(this.player1.amber).toBe(2);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.bumpsy, this.magdaTheRat);
            this.player2.fightWith(this.troll, this.magdaTheRat);
            expect(this.magdaTheRat.location).toBe('discard');
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(0);
        });
    });
});
