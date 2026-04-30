describe('Arcane Relief', function () {
    describe("Arcane Relief's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    hand: ['arcane-relief'],
                    inPlay: ['caspart']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('readies and uses a friendly exhausted creature', function () {
            this.caspart.exhaust();
            const before = this.player1.amber;
            this.player1.play(this.arcaneRelief);
            this.player1.clickCard(this.caspart);
            // bonus pip (+1) + reap (+1)
            expect(this.player1.amber).toBe(before + 2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target ready creature', function () {
            this.player1.play(this.arcaneRelief);
            expect(this.player1).not.toBeAbleToSelect(this.caspart);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
