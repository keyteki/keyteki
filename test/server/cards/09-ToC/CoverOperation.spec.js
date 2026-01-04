describe('Cover Operation', function () {
    describe("Cover Operation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    hand: ['cover-operation']
                },
                player2: {
                    amber: 1
                }
            });

            this.stooge1 = this.player1.player.deck[0];
        });

        it('should make and ready a token', function () {
            this.player1.play(this.coverOperation);
            expect(this.stooge1.location).toBe('play area');
            expect(this.stooge1.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
