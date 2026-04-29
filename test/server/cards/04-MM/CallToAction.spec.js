describe('Call to Action', function () {
    describe("Call to Action's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['call-to-action'],
                    inPlay: [
                        'brobnar-ambassador',
                        'brammo',
                        'francus',
                        'gatekeeper',
                        'duma-the-martyr'
                    ]
                },
                player2: {
                    inPlay: ['bulwark'],
                    hand: ['bad-penny']
                }
            });

            this.brobnarAmbassador.exhaust();
            this.brammo.exhaust();
            this.francus.exhaust();
            this.gatekeeper.exhaust();
            this.dumaTheMartyr.exhaust();
            this.bulwark.exhaust();
        });

        it('should ready all friendly knights', function () {
            this.player1.play(this.callToAction);
            expect(this.brobnarAmbassador.exhausted).toBe(true);
            expect(this.brammo.exhausted).toBe(false);
            expect(this.francus.exhausted).toBe(false);
            expect(this.gatekeeper.exhausted).toBe(false);
            expect(this.dumaTheMartyr.exhausted).toBe(true);
            expect(this.bulwark.exhausted).toBe(true);
        });
    });
});
