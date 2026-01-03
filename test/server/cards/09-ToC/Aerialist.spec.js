describe('Aerialist', function () {
    describe("Aerialist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    token: 'aerialist',
                    inPlay: ['aerialist:toad', 'bux-bastian']
                },
                player2: {
                    amber: 2
                }
            });

            this.aerialist1 = this.player1.player.creaturesInPlay[0];
        });

        it('should do nothing without yellow key forged', function () {
            this.player1.reap(this.aerialist1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.aerialist1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should capture 1 with the yellow key forged', function () {
            this.player1.player.keys = { red: false, blue: false, yellow: true };
            this.player1.reap(this.aerialist1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.aerialist1.amber).toBe(1);
            this.player1.reap(this.buxBastian);
            expect(this.player2.amber).toBe(1);
            expect(this.buxBastian.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
