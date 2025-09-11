describe('Steppe Wolf', function () {
    describe("Steppe Wolf's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    token: 'steppe-wolf',
                    inPlay: ['steppe-wolf:toad', 'moor-wolf', 'ornate-talking-tray']
                },
                player2: {
                    amber: 2,
                    inPlay: ['moor-wolf']
                }
            });

            this.steppeWolf1 = this.player1.player.creaturesInPlay[0];
            this.steppeWolf2 = this.player1.player.deck[0];
        });

        it('should gain 1 power for other friendly wolf creatures', function () {
            expect(this.steppeWolf1.getPower()).toBe(2);
            this.player1.useAction(this.ornateTalkingTray, true);
            this.player1.clickPrompt('Right');
            expect(this.steppeWolf1.getPower()).toBe(3);
            expect(this.steppeWolf2.getPower()).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
