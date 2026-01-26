describe('EarlyBirds', function () {
    describe("EarlyBirds's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    inPlay: ['lamindra', 'murkens', 'tantadlin', 'guard-disguise', 'bear-flute'],
                    hand: ['early-birds']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });

            this.lamindra.exhaust();
            this.murkens.exhaust();
            this.tantadlin.exhaust();
            this.bearFlute.exhaust();
            this.guardDisguise.exhaust();
        });

        it('should ready all shadows cards', function () {
            this.player1.play(this.earlyBirds);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.murkens.exhausted).toBe(false);
            expect(this.guardDisguise.exhausted).toBe(false);
            expect(this.tantadlin.exhausted).toBe(true);
            expect(this.bearFlute.exhausted).toBe(true);
        });
    });
});
