describe('Mantle of the Zealot', function () {
    describe("Mantle of the Zealot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['grabber-jammer'],
                    hand: ['mantle-of-the-zealot']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('should allow using a non-house card', function () {
            this.player1.playUpgrade(this.mantleOfTheZealot, this.grabberJammer);
            this.player1.clickCard(this.grabberJammer);
            expect(this.player1).toHavePrompt('Grabber Jammer');
            this.player1.clickPrompt('Fight with this creature');
            this.player1.clickCard(this.troll);
            expect(this.grabberJammer.location).toBe('discard');
        });
    });
});
