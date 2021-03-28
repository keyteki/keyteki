describe('Paraguardian', function () {
    describe("Paraguardian's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['gub', 'paraguardian', 'shooler']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should exalt Paraguardian and ward its neighbors', function () {
            this.player1.reap(this.paraguardian);

            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.paraguardian);

            expect(this.paraguardian.amber).toBe(1);
            expect(this.paraguardian.warded).toBe(false);
            expect(this.shooler.warded).toBe(true);
            expect(this.gub.warded).toBe(true);
            expect(this.lamindra.warded).toBe(false);
        });

        it('should not ward neighbors if player does not exalt Paraguardian', function () {
            this.player1.reap(this.paraguardian);

            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickPrompt('Done');

            expect(this.paraguardian.hasToken('amber')).toBe(false);
            expect(this.paraguardian.warded).toBe(false);
            expect(this.shooler.warded).toBe(false);
            expect(this.gub.warded).toBe(false);
            expect(this.lamindra.warded).toBe(false);
        });
    });
});
