describe("Sobogg's Thingamabob", function () {
    describe("Sobogg's Thingamabob's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armsmaster-molina', 'sobogg-s-thingamabob']
                },
                player2: {
                    inPlay: ['lamindra', 'murkens']
                }
            });
        });

        describe('when opponent forges a key', function () {
            beforeEach(function () {
                this.player2.amber = 6;
                this.player1.endTurn();
                this.player2.forgeKey('Red');
                this.player2.clickPrompt('shadows');
            });

            it('should exhaust each of their creatures', function () {
                expect(this.murkens.exhausted).toBe(true);
                expect(this.lamindra.exhausted).toBe(true);
                expect(this.armsmasterMolina.exhausted).toBe(false);
            });

            describe('when owner forges a key', function () {
                beforeEach(function () {
                    this.player1.amber = 6;
                    this.player2.endTurn();
                    this.player1.forgeKey('Red');
                    this.player1.clickPrompt('staralliance');
                });

                it('should not exhaust each of my creatures', function () {
                    expect(this.lamindra.exhausted).toBe(false);
                    expect(this.lamindra.exhausted).toBe(false);
                    expect(this.armsmasterMolina.exhausted).toBe(false);
                });
            });
        });
    });
});
