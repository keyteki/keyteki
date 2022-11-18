describe('B0-T', function () {
    describe("B0-T's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    token: 'b0-t',
                    amber: 1,
                    inPlay: ['b0-t', 'helper-bot', 'armsmaster-molina', 'senator-shrix']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should allow to use a non-star-alliance creature', function () {
            this.player1.useAction(this.b0T);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).not.toBeAbleToSelect(this.armsmasterMolina);
            this.player1.clickCard(this.helperBot);
            this.player1.clickPrompt('Reap with this creature');
            expect(this.player1.amber).toBe(2);
        });
    });
});
