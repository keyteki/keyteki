describe('Larie Of TheLake Evil Twin', function () {
    describe('when the tide is neutral', function () {
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

        it('should not increase own armor', function () {
            expect(this.francus.armor).toBe(1);
            expect(this.lærieOfTheLakeEvilTwin.armor).toBe(0);
            expect(this.fidgit.armor).toBe(0);
            expect(this.murkens.armor).toBe(0);
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

            describe('when the tide is low', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('shadows');
                    this.player2.raiseTide();
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
});
