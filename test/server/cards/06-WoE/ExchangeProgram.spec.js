describe('Exchange Program', function () {
    describe("Exchange Program's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer'],
                    hand: ['exchange-program']
                },
                player2: {
                    inPlay: ['selwyn-the-fence', 'flaxia', 'bumpsy']
                }
            });
        });

        it('allows player to swap a flank creature with opponent', function () {
            this.player1.play(this.exchangeProgram);
            expect(this.player1).toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).not.toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.player1).not.toBeAbleToSelect(this.antiquitiesDealer);
            expect(this.player1).toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            this.player1.clickCard(this.bumpsy);
            expect(this.player1.player.cardsInPlay).toContain(this.bumpsy);
            expect(this.player1.player.cardsInPlay).not.toContain(this.antiquitiesDealer);
            expect(this.player2.player.cardsInPlay).not.toContain(this.bumpsy);
            expect(this.player2.player.cardsInPlay).toContain(this.antiquitiesDealer);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing if no creatures in play one side', function () {
            this.player1.fightWith(this.antiquitiesDealer, this.flaxia);
            this.player1.play(this.exchangeProgram);
            expect(this.antiquitiesDealer.location).toBe('discard');
            expect(this.player1).not.toBeAbleToSelect(this.selwynTheFence);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
