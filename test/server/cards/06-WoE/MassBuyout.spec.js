describe('Mass Buyout', function () {
    describe("Mass Buyout's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    hand: ['mass-buyout'],
                    inPlay: ['pelf', 'bumpsy', 'antiquities-dealer', 'ikwijĭ-outpost']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'murkens', 'umbra', 'anomaly-exploiter']
                }
            });

            this.gub.ward();
            this.player1.play(this.massBuyout);
        });

        it('should destroy all creatures', function () {
            expect(this.pelf.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.gub.location).toBe('play area');
            expect(this.murkens.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.ikwijĭOutpost.location).toBe('play area');
            expect(this.anomalyExploiter.location).toBe('play area');
        });

        it('each player should gain amber for half of the creatures destroyed this way', function () {
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });
    });
});
