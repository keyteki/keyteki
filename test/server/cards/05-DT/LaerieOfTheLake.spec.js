describe('Larie Of TheLake', function () {
    describe("Larie Of TheLake's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    inPlay: ['lærie-of-the-lake', 'fidgit', 'francus']
                },
                player2: {
                    amber: 2,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when the tide is neutral', function () {
            it('should increase armor of friendly creatures', function () {
                expect(this.lærieOfTheLake.armor).toBe(0);
                expect(this.fidgit.armor).toBe(0);
                expect(this.francus.armor).toBe(1);
                expect(this.murkens.armor).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should increase armor of friendly creatures', function () {
                expect(this.lærieOfTheLake.armor).toBe(2);
                expect(this.fidgit.armor).toBe(2);
                expect(this.francus.armor).toBe(3);
                expect(this.murkens.armor).toBe(0);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should not increase armor of friendly creatures', function () {
                expect(this.lærieOfTheLake.armor).toBe(0);
                expect(this.fidgit.armor).toBe(0);
                expect(this.francus.armor).toBe(1);
                expect(this.murkens.armor).toBe(0);
            });
        });
    });
});
