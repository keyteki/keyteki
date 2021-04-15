describe('Seabringer Kekoa', function () {
    describe("Seabringer Kekoa's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'dis',
                    hand: ['gateway-to-dis']
                },
                player2: {
                    amber: 4,
                    inPlay: ['seabringer-kekoa']
                }
            });
        });

        it('should raise the tide when destroyed', function () {
            this.player1.play(this.gatewayToDis);
            expect(this.player1.chains).toBe(3);
            expect(this.seabringerKekoa.location).toBe('discard');
            expect(this.player1.isTideLow()).toBe(true);
            expect(this.player2.isTideHigh()).toBe(true);
            expect(this.player2.chains).toBe(0);
        });
    });
});
