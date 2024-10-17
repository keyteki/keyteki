describe('Hayell the Merchant', function () {
    describe("Hayell the Merchant's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['hayyel-the-merchant'],
                    hand: ['hallowed-blaster']
                },
                player2: {
                    inPlay: []
                }
            });
        });

        it('should trigger when playing an artifact', function () {
            this.player1.play(this.hallowedBlaster);
            expect(this.player1.amber).toBe(1);
        });

        it('should not trigger under ABC circumstances', function () {});

        it('should have DEF effect on GHI', function () {});
    });
});
