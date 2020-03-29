describe('Ant110ny', function() {
    integration(function() {
        describe('Play ability', function() {
            beforeEach(function() {
                this.setupTest({
                    player1: {
                        house: 'staralliance',
                        hand: ['ant1-10ny']
                    },
                    player2: {
                        amber: 5
                    }
                });
                this.player1.play(this.ant110ny);
            });

            it('should capture all enemy amber', function() {
                expect(this.player2.amber).toBe(0);
                expect(this.ant110ny.tokens.amber).toBe(5);
            });

            describe('Constant ability', function() {
                beforeEach(function() {
                    this.player1.endTurn();
                });

                it('should capture all enemy amber', function() {
                    expect(this.player2.amber).toBe(1);
                    expect(this.ant110ny.tokens.amber).toBe(4);
                });
            });
            describe('Constant ability with no captured amber', function() {
                beforeEach(function() {
                    this.ant110ny.tokens.amber = 0;
                    this.player1.endTurn();
                });

                it('no amber should move', function() {
                    expect(this.player2.amber).toBe(0);
                    expect(this.ant110ny.tokens.amber).toBe(0);
                });
            });
        });
    });
});
