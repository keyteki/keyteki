describe('Colonist Chapman', function () {
    describe("Colonist Chapman's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'staralliance',
                    inPlay: ['snufflegator', 'colonist-chapman', 'armsmaster-molina']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });
        });

        describe('when it reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.colonistChapman);
            });

            it('should not gain extra 1A', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(4);
            });
        });

        describe('when a SA neighbor reaps', function () {
            beforeEach(function () {
                this.player1.reap(this.armsmasterMolina);
            });

            it('should not gain extra 1A', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(4);
            });
        });

        describe('when a non-A neighbor reaps', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.endTurn();
                this.player1.clickPrompt('untamed');
                this.player1.reap(this.snufflegator);
            });

            it('should gain an extra 1A', function () {
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(4);
            });
        });
    });
});
