describe('Binding Irons', function () {
    describe("Binding Irons's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['binding-irons']
                },
                player2: {
                    chains: 0
                }
            });
        });

        it('should give opponent 3 chains on play', function () {
            this.player1.play(this.bindingIrons);
            expect(this.player2.chains).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
