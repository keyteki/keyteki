describe('The Common Cold', function () {
    describe("The Common Cold's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['the-common-cold']
                },
                player2: {
                    inPlay: ['grabber-jammer']
                }
            });
            this.grabberJammer.tokens.ward = 1;
        });

        it('should be able to destroy warded Mars creatures', function () {
            this.player1.play(this.theCommonCold);
            this.player1.clickPrompt('Yes');
            expect(this.grabberJammer.location).toBe('discard');
        });
    });
});
