describe('Incarnation Pod', function () {
    describe("Incarnation Pod's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    hand: ['incarnation-pod'],
                    discard: ['generous-offer']
                },
                player2: {
                    discard: ['cursed-relic']
                }
            });
        });

        describe('on action use', function () {
            beforeEach(function () {
                this.player1.play(this.incarnationPod);
                this.player1.endTurn();
                this.player2.clickPrompt('ekwidon');
                this.player2.endTurn();
                this.player1.clickPrompt('ekwidon');
            });

            it('can put a card from player discard on bottom of deck', function () {
                this.player1.useAction(this.incarnationPod);
                expect(this.player1).toBeAbleToSelect(this.generousOffer);
                expect(this.player1).toBeAbleToSelect(this.cursedRelic);
                this.player1.clickCard(this.generousOffer);
                expect(this.generousOffer.location).toBe('deck');
                expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(
                    this.generousOffer
                );
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('can put a card from opponent discard on bottom of deck', function () {
                this.player1.useAction(this.incarnationPod);
                expect(this.player1).toBeAbleToSelect(this.generousOffer);
                expect(this.player1).toBeAbleToSelect(this.cursedRelic);
                this.player1.clickCard(this.cursedRelic);
                expect(this.cursedRelic.location).toBe('deck');
                expect(this.player2.player.deck[this.player2.player.deck.length - 1]).toBe(
                    this.cursedRelic
                );
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });

        it('can purge bottom of each deck on scrap', function () {
            this.player1.moveCard(this.generousOffer, 'deck');
            let bottom = this.player1.deck[this.player1.deck.length - 1];
            this.player1.deck[0] = bottom;
            this.player1.deck[this.player1.deck.length - 1] = this.generousOffer;
            this.player2.moveCard(this.cursedRelic, 'deck');
            bottom = this.player2.deck[this.player2.deck.length - 1];
            this.player2.deck[0] = bottom;
            this.player2.deck[this.player2.deck.length - 1] = this.cursedRelic;
            this.player1.clickCard(this.incarnationPod);
            this.player1.clickPrompt('Discard this card');
            expect(this.generousOffer.location).toBe('purged');
            expect(this.cursedRelic.location).toBe('purged');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
