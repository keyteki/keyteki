describe('Draining Touch', function () {
    describe("Draining Touch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['draining-touch'],
                    inPlay: ['dendrix']
                },
                player2: {
                    hand: ['mind-barb'],
                    inPlay: ['dust-imp', 'spyyyder']
                }
            });
            this.spyyyder.addToken('amber');
            this.dendrix.addToken('amber', 4);
        });
        it('should allow creatures without amber on them to be selected for destruction', function () {
            this.player1.play(this.drainingTouch);
            expect(this.player1).toHavePrompt('Draining Touch');
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.spyyyder);
            expect(this.player1).not.toBeAbleToSelect(this.dendrix);
            this.player1.clickCard(this.dustImp);
            expect(this.dustImp.location).toBe('discard');
        });
    });
    describe("Draining Touch's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['draining-touch'],
                    inPlay: ['dendrix']
                },
                player2: {
                    hand: ['mind-barb'],
                    inPlay: ['dust-imp', 'spyyyder']
                }
            });
            this.spyyyder.addToken('amber');
            this.dendrix.addToken('amber', 4);
            this.dustImp.addToken('amber');
        });
        it('should fizzle when there are no creatures without amber', function () {
            this.player1.play(this.drainingTouch);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
