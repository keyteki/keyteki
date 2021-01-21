describe('Larie Of TheLake', function () {
    describe('when the tide is neutral', function () {
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

        it('should increase armor of friendly creatures', function () {
            expect(this.lærieOfTheLake.armor).toBe(0);
            expect(this.fidgit.armor).toBe(0);
            expect(this.francus.armor).toBe(1);
            expect(this.murkens.armor).toBe(0);
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

            describe('when the tide is low', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.raiseTide();
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
});
