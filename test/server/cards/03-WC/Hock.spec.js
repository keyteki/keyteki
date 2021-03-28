describe('Hock', function () {
    describe("Hock's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['flaxia', 'lifeward'],
                    hand: ['hock']
                },
                player2: {
                    inPlay: ['lamindra', 'fetchdrones']
                }
            });
        });

        it('Destroy a friendly artifact and gain 1 amber', function () {
            this.player1.play(this.hock);

            expect(this.player1).toHavePrompt('Hock');

            expect(this.player1).toBeAbleToSelect(this.lifeward);
            expect(this.player1).toBeAbleToSelect(this.fetchdrones);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.lifeward);

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });

        it('Destroy an enemy artifact and gain 1 amber', function () {
            this.player1.play(this.hock);

            expect(this.player1).toHavePrompt('Hock');

            expect(this.player1).toBeAbleToSelect(this.lifeward);
            expect(this.player1).toBeAbleToSelect(this.fetchdrones);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.lamindra);

            this.player1.clickCard(this.fetchdrones);

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(0);
        });

        it('There is no artifact in play, so no extra amber', function () {
            this.player1.moveCard(this.lifeward, 'hand');
            this.player1.moveCard(this.fetchdrones, 'hand');

            this.player1.play(this.hock);

            expect(this.player1).not.toHavePrompt('Hock');

            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
        });
    });
});
