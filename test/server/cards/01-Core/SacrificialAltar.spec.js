describe('Sacrificial Altar', function () {
    describe("Sacrificial Altar's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['sacrificial-altar', 'ember-imp'],
                    discard: ['shooler']
                },
                player2: {}
            });
        });

        it('should purge a Human creature and play a creature from discard', function () {
            this.player1.useAction(this.sacrificialAltar);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('purged');
            expect(this.player1).toBeAbleToSelect(this.shooler);
            this.player1.clickCard(this.shooler);
            expect(this.shooler.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not target non-Human creatures', function () {
            this.player1.moveCard(this.shooler, 'play area');
            this.player1.useAction(this.sacrificialAltar);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
