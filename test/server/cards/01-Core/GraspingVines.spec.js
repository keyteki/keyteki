describe('Grasping Vines', function () {
    describe("Grasping Vines's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['library-of-babble'],
                    hand: ['grasping-vines']
                },
                player2: {
                    inPlay: ['dominator-bauble', 'gorm-of-omm']
                }
            });
            this.player1.play(this.graspingVines);
        });

        it('should prompt the player to choose up to 3 artifacts', function () {
            expect(this.player1).toHavePrompt('Grasping Vines');
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).toBeAbleToSelect(this.dominatorBauble);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should return chosen artifacts to hand', function () {
            this.player1.clickCard(this.dominatorBauble);
            this.player1.clickCard(this.gormOfOmm);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.dominatorBauble.location).toBe('hand');
            expect(this.gormOfOmm.location).toBe('hand');
        });
    });
});
