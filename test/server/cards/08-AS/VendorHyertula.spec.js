describe('Vendor Hyertula', function () {
    describe("Vendor Hyertula's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    inPlay: ['vendor-hyertula', 'ornate-talking-tray']
                },
                player2: {
                    amber: 6,
                    inPlay: ['library-of-babble', 'ritual-of-balance', 'uncommon-currency']
                }
            });
        });

        it('should allow you to not destroy itself', function () {
            this.player1.reap(this.vendorHyertula);
            expect(this.player1).toBeAbleToSelect(this.vendorHyertula);
            this.player1.clickPrompt('Done');
            expect(this.vendorHyertula.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow you to take control of an artifact', function () {
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            expect(this.vendorHyertula.location).toBe('discard');
            expect(this.player1).toBeAbleToSelect(this.libraryOfBabble);
            expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            expect(this.player1).toBeAbleToSelect(this.uncommonCurrency);
            expect(this.player1).not.toBeAbleToSelect(this.ornateTalkingTray);
            this.player1.clickCard(this.ritualOfBalance);
            expect(this.ritualOfBalance.controller).toBe(this.player1.player);
            this.player1.useAction(this.ritualOfBalance);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should revert the artifact to its original house after losing control', function () {
            this.player1.reap(this.vendorHyertula);
            this.player1.clickCard(this.vendorHyertula);
            this.player1.clickCard(this.ritualOfBalance);
            this.player1.useAction(this.ritualOfBalance);
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.useAction(this.uncommonCurrency);
            this.player2.clickCard(this.ritualOfBalance);
            this.player2.clickCard(this.ritualOfBalance);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.useAction(this.ritualOfBalance);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
