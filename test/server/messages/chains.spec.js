describe('Chains Messages', function () {
    describe('gain chains', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['binding-irons']
                },
                player2: {}
            });
        });

        it('should log correct message when opponent gains chains', function () {
            this.player1.play(this.bindingIrons);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Binding Irons',
                'player1 uses Binding Irons to give player2 3 chains'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
