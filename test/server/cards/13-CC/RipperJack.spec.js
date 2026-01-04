describe('Ripper Jack', function () {
    describe("Ripper Jack's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    hand: ['ripper-jack'],
                    amber: 0
                },
                player2: {
                    inPlay: ['lamindra', 'tantadlin'],
                    amber: 3
                }
            });
        });

        it('should steal 1 amber when played', function () {
            this.player1.play(this.ripperJack);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should return to hand after fighting', function () {
            this.player1.play(this.ripperJack);
            this.ripperJack.exhausted = false;
            this.player1.fightWith(this.ripperJack, this.lamindra);
            expect(this.ripperJack.location).toBe('hand');
            expect(this.player1.player.hand).toContain(this.ripperJack);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
