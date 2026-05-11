describe('Armory Officer Nel', function () {
    describe("Armory Officer Nel's reaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armory-officer-nel', 'stealthster'],
                    hand: ['z-ray-blaster']
                },
                player2: {}
            });
        });

        it('draws a card after an upgrade enters play', function () {
            const handBefore = this.player1.hand.length;
            this.player1.playUpgrade(this.zRayBlaster, this.stealthster);
            expect(this.player1.hand.length).toBe(handBefore - 1 + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent plays an upgrade', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['armory-officer-nel']
                },
                player2: {
                    house: 'staralliance',
                    inPlay: ['stealthster'],
                    hand: ['z-ray-blaster']
                }
            });
        });

        it('also draws a card', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            const handBefore = this.player1.hand.length;
            this.player2.playUpgrade(this.zRayBlaster, this.stealthster);
            expect(this.player1.hand.length).toBe(handBefore + 1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
