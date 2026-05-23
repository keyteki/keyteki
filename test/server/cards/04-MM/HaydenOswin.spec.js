describe('Hayden Oswin', function () {
    describe("Hayden Oswin's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['hayden-oswin'],
                    hand: ['z-ray-blaster', 'z-wave-emitter']
                },
                player2: {}
            });
        });

        it('gains base 1A from reap with no upgrades', function () {
            this.player1.reap(this.haydenOswin);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gains 1A per upgrade on reap (in addition to reap base)', function () {
            this.player1.playUpgrade(this.zRayBlaster, this.haydenOswin);
            this.player1.playUpgrade(this.zWaveEmitter, this.haydenOswin);
            expect(this.player1.amber).toBe(2);
            this.player1.reap(this.haydenOswin);
            expect(this.player1.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
