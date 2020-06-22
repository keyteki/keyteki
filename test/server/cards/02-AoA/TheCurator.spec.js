describe('The Curator', function () {
    describe("The Curator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    hand: ['seeker-needle', 'skeleton-key', 'subtle-maul'],
                    inPlay: ['the-curator']
                },
                player2: {
                    amber: 2,
                    hand: ['remote-access']
                }
            });
        });
        it('should ready ALL artifacts played by the owner', function () {
            this.player1.play(this.skeletonKey);
            this.player1.play(this.subtleMaul);
            expect(this.skeletonKey.exhausted).toBe(false);
            expect(this.subtleMaul.exhausted).toBe(false);
        });
    });

    describe("The Curator's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'untamed',
                    inPlay: ['the-curator']
                },
                player2: {
                    amber: 1,
                    house: 'shadows',
                    hand: ['seeker-needle', 'skeleton-key', 'subtle-maul']
                }
            });
        });

        it('should NOT ready creatures played by the opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.skeletonKey);
            this.player2.play(this.subtleMaul);
            expect(this.skeletonKey.exhausted).toBe(true);
            expect(this.subtleMaul.exhausted).toBe(true);
        });
    });
});
