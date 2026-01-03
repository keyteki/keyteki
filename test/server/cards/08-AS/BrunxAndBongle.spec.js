describe('Brunx and Bongle', function () {
    describe("Brunx and Bongle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'brobnar',
                    hand: ['anger'],
                    inPlay: ['brunx-and-bongle']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should allow a reap after a fight', function () {
            this.player1.fightWith(this.brunxAndBongle, this.lamindra);
            this.player1.clickCard(this.brunxAndBongle);
            expect(this.player1.amber).toBe(2);
            expect(this.brunxAndBongle.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should be optional', function () {
            this.player1.fightWith(this.brunxAndBongle, this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.player1.amber).toBe(1);
            expect(this.brunxAndBongle.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should only work once', function () {
            this.player1.fightWith(this.brunxAndBongle, this.lamindra);
            this.player1.clickCard(this.brunxAndBongle);
            this.player1.play(this.anger);
            this.player1.clickCard(this.brunxAndBongle);
            this.player1.clickCard(this.lamindra);
            expect(this.player1.amber).toBe(3); // One reap + anger
            expect(this.brunxAndBongle.exhausted).toBe(true);
            expect(this.lamindra.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
