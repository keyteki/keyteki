describe('Hayyel the Merchant', function () {
    describe("Hayyel the Merchant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['hayyel-the-merchant'],
                    hand: ['hallowed-blaster']
                },
                player2: {
                    house: 'dis',
                    hand: ['dominator-bauble']
                }
            });
        });

        it('should gain 1 amber only when you play an artifact', function () {
            this.player1.play(this.hallowedBlaster);
            expect(this.player1.amber).toBe(1);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.dominatorBauble);
            expect(this.player1.amber).toBe(1);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
