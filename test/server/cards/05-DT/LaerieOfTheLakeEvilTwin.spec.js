describe('Larie Of TheLake Evil Twin', function () {
    describe("Larie Of TheLake Evil Twin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['francus', 'fidgit', 'lærie-of-the-lake-evil-twin']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            it('should not increase own armor', function () {
                expect(this.francus.armor).toBe(1);
                expect(this.lærieOfTheLakeEvilTwin.armor).toBe(0);
                expect(this.fidgit.armor).toBe(0);
                expect(this.murkens.armor).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should increase its own armor', function () {
                expect(this.francus.armor).toBe(1);
                expect(this.lærieOfTheLakeEvilTwin.armor).toBe(5);
                expect(this.fidgit.armor).toBe(0);
                expect(this.murkens.armor).toBe(0);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not increase own armor', function () {
                expect(this.francus.armor).toBe(1);
                expect(this.lærieOfTheLakeEvilTwin.armor).toBe(0);
                expect(this.fidgit.armor).toBe(0);
                expect(this.murkens.armor).toBe(0);
            });
        });
    });
});
