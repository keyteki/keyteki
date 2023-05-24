describe('Ikwikĭ Outpost', function () {
    describe("Ikwikĭ Outpost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    inPlay: ['antiquities-dealer', 'ikwiki-outpost'],
                    deck: ['pelf', 'pelf', 'pelf']
                },
                player2: {
                    inPlay: ['kelifi-dragon']
                }
            });
        });

        it('put a creature on the bottom of your deck and draw 3 cards', function () {
            let handSize = this.player1.hand.length;
            this.player1.useAction(this.ikwikiOutpost);
            this.player1.clickCard(this.antiquitiesDealer);
            expect(this.antiquitiesDealer.location).toBe('deck');
            expect(this.player1.hand.length).toBe(handSize + 3);
        });

        it('should fizzle with no creatures in play', function () {
            this.player1.fightWith(this.antiquitiesDealer, this.kelifiDragon);
            this.player1.useAction(this.ikwikiOutpost);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
