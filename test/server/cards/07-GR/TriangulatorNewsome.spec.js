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
            this.medicIngram.amber = 3;
            this.triangulatorNewsome.amber = 1;
            this.cpoZytar.amber = 2;
            this.batdrone.amber = 10;
        });

        it('does nothing when not haunted', function () {
            this.player1.reap(this.triangulatorNewsome);
            expect(this.medicIngram.amber).toBe(3);
            expect(this.triangulatorNewsome.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(2);
            expect(this.batdrone.amber).toBe(10);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('moves amber from neighbors to your pool when haunted', function () {
            this.player1.play(this.stealthMode);
            this.player1.reap(this.triangulatorNewsome);
            expect(this.medicIngram.amber).toBe(0);
            expect(this.triangulatorNewsome.amber).toBe(1);
            expect(this.cpoZytar.amber).toBe(0);
            expect(this.batdrone.amber).toBe(10);
            expect(this.player1.amber).toBe(8);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
