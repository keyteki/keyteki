describe('On the Mark', function () {
    describe("On the Mark's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['on-the-mark'],
                    inPlay: ['ganger-chieftain', 'shock-herder']
                },
                player2: {
                    inPlay: ['lamindra', 'dew-faerie']
                }
            });

            this.shockHerder.amber = 3;
        });

        it('should move amber from a friendly to an enemy creature', function () {
            this.player1.play(this.onTheMark);
            expect(this.player1).toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).toBeAbleToSelect(this.shockHerder);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.dewFaerie);
            this.player1.clickCard(this.shockHerder);
            expect(this.player1).not.toBeAbleToSelect(this.gangerChieftain);
            expect(this.player1).not.toBeAbleToSelect(this.shockHerder);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.dewFaerie);
            this.player1.clickCard(this.lamindra);
            expect(this.shockHerder.amber).toBe(0);
            expect(this.lamindra.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work if friendly creature has no amber', function () {
            this.player1.play(this.onTheMark);
            this.player1.clickCard(this.gangerChieftain);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work if there are no friendly creatures', function () {
            this.player1.moveCard(this.shockHerder, 'discard');
            this.player1.moveCard(this.gangerChieftain, 'discard');
            this.player1.play(this.onTheMark);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work if there are no enemy creatures', function () {
            this.player1.moveCard(this.lamindra, 'discard');
            this.player1.moveCard(this.dewFaerie, 'discard');
            this.player1.play(this.onTheMark);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
