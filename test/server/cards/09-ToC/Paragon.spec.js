describe('Paragon', function () {
    describe("Paragon's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    token: 'paragon',
                    hand: ['dysania'],
                    inPlay: ['ornate-talking-tray']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dust-pixie'],
                    discard: ['snarette']
                }
            });

            this.paragon1 = this.player1.player.deck[0];
        });

        it('should not enter play enraged if no mutants', function () {
            this.player1.useAction(this.ornateTalkingTray, true);
            expect(this.paragon1.location).toBe('play area');
            expect(this.paragon1.enraged).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should enter play enraged if a mutant in play', function () {
            this.player1.playCreature(this.dysania);
            this.player1.useAction(this.ornateTalkingTray, true);
            this.player1.clickPrompt('Right');
            expect(this.paragon1.location).toBe('play area');
            expect(this.paragon1.enraged).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should enter play enraged if enemy mutant in play', function () {
            this.player2.moveCard(this.snarette, 'play area');
            this.player1.useAction(this.ornateTalkingTray, true);
            expect(this.paragon1.location).toBe('play area');
            expect(this.paragon1.enraged).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
