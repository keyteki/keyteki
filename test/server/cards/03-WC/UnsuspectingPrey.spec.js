describe('Unsuspecting Prey', function () {
    describe("Unsuspecting Prey's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['snufflegator'],
                    hand: ['unsuspecting-prey']
                },
                player2: {
                    inPlay: ['dust-imp', 'snudge', 'spyyyder']
                }
            });
        });

        it('should allow the player to choose 0 creatures', function () {
            this.player1.play(this.unsuspectingPrey);
            expect(this.player1).toHavePrompt('Unsuspecting Prey');
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.snudge);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should allow the player to choose up to 3 creatures', function () {
            this.player1.play(this.unsuspectingPrey);
            expect(this.player1).toHavePrompt('Unsuspecting Prey');
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.snudge);
            expect(this.player1).toBeAbleToSelect(this.spyyyder);
            this.player1.clickCard(this.dustImp);
            this.player1.clickCard(this.snudge);
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Done');
            expect(this.dustImp.location).toBe('discard');
            expect(this.snudge.tokens.damage).toBe(2);
            expect(this.snufflegator.tokens.damage).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
        it('should only allow player to choose undamaged creatures', function () {
            this.dustImp.tokens.damage = 1;
            this.snudge.tokens.damage = 1;
            this.snufflegator.tokens.damage = 1;
            this.player1.play(this.unsuspectingPrey);
            expect(this.player1).toHavePrompt('Unsuspecting Prey');
            expect(this.player1).not.toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.snudge);
            expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
            expect(this.player1).toBeAbleToSelect(this.spyyyder);
        });
    });
});
