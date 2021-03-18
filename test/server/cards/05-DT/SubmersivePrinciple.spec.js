describe('Submersive Principle', function () {
    describe('when the tide is neutral', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 3,
                    hand: ['submersive-principle']
                },
                player2: {
                    amber: 8
                }
            });
        });

        it('should make it player lose 1 amber', function () {
            this.player1.play(this.submersivePrinciple);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(7);
            expect(this.player1.chains).toBe(0);
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should make it player lose 1 amber', function () {
                this.player1.play(this.submersivePrinciple);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(7);
                expect(this.player1.chains).toBe(0);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should make it player lose half of their amber', function () {
                this.player1.play(this.submersivePrinciple);
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(4);
                expect(this.player1.chains).toBe(3);
            });
        });
    });
});
