describe('Unsuspecting Prey', function() {
    integration(function() {
        describe('Unsuspecting Prey\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'untamed',
                        inPlay: ['snufflegator'],
                        hand: ['unsuspecting-prey']
                    },
                    player2: {
                        inPlay: ['dust-imp','snudge','spyyyder']
                    }
                });
                this.player1.play(this.unsuspectingPrey);
            });

            it('should prompt the player to choose up to 3 creatures (including 0)', function() {
                expect(this.player1).toHavePrompt('Unsuspecting Prey');
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
                expect(this.player1).toBeAbleToSelect(this.dustImp);
                expect(this.player1).toBeAbleToSelect(this.snudge);
                expect(this.player1).toBeAbleToSelect(this.spyyyder);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
            it('should prompt the player to choose up to 3 creatures (including 0)', function() {
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
        });
    });
});
