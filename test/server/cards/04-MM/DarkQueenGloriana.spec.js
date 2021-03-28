describe('Dark Queen Gloriana', function () {
    describe("Dark Queen Gloriana's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['legatus-raptor', 'flaxia', 'lamindra', 'amphora-captura'],
                    hand: ['dark-queen-gloriana']
                },
                player2: {
                    hand: ['troll', 'bumblebird']
                }
            });
        });

        it('should return a friendly non-untamed creature to hand', function () {
            this.player1.play(this.darkQueenGloriana);
            expect(this.player1).toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.darkQueenGloriana);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.bumblebird);
            expect(this.player1).not.toBeAbleToSelect(this.amphoraCaptura);
            this.player1.clickCard(this.lamindra);
            expect(this.lamindra.location).toBe('hand');
        });
    });
});
