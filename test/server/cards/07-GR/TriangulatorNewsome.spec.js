describe('Triangulator Newsome', function () {
    describe("Triangulator Newsome's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    hand: ['stealth-mode'],
                    inPlay: ['medic-ingram', 'triangulator-newsome', 'cpo-zytar', 'batdrone'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
            this.medicIngram.tokens.amber = 3;
            this.triangulatorNewsome.tokens.amber = 1;
            this.cpoZytar.tokens.amber = 2;
            this.batdrone.tokens.amber = 10;
        });

        it('does nothing when not haunted', function () {
            this.player1.reap(this.triangulatorNewsome);
            expect(this.medicIngram.amber).toBe(3);
            expect(this.triangulatorNewsome.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(2);
            expect(this.batdrone.amber).toBe(10);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('moves amber from neighbors to your pool when haunted', function () {
            this.player1.play(this.stealthMode);
            this.player1.reap(this.triangulatorNewsome);
            expect(this.medicIngram.amber).toBe(0);
            expect(this.triangulatorNewsome.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(0);
            expect(this.batdrone.amber).toBe(10);
            expect(this.player1.amber).toBe(8);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
