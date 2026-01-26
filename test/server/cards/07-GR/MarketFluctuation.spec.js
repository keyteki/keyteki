describe('Market Fluctuation', function () {
    describe("Market Fluctuation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: [
                        'market-fluctuation',
                        'auction-off',
                        'mass-buyout',
                        'hire-on',
                        'drumble'
                    ],
                    inPlay: ['greed', 'wrath', 'envy'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1,
                    hand: ['stealth-mode', 'timetraveller', 'rogue-operation'],
                    inPlay: ['cpo-zytar', 'master-of-1', 'master-of-2', 'master-of-3'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
            this.player1.moveCard(this.greed, 'deck');
            this.player1.moveCard(this.wrath, 'deck');
            this.player1.moveCard(this.envy, 'deck');
            this.player2.moveCard(this.masterOf1, 'deck');
            this.player2.moveCard(this.masterOf2, 'deck');
            this.player2.moveCard(this.masterOf3, 'deck');
        });

        it('causes each haunted player to draw 3', function () {
            this.player1.play(this.massBuyout);
            this.player1.play(this.marketFluctuation);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('causes each non-haunted player to discard 3 at random', function () {
            this.player1.play(this.marketFluctuation);
            // Both players discard, so we get prompted for order
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('causes one haunted player to draw 3, and one non-haunted player to discard 3 at random', function () {
            this.player1.play(this.auctionOff);
            this.player1.play(this.marketFluctuation);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can cause a haunted player to become unhaunted', function () {
            this.player1.player.deck = [];
            this.player1.play(this.auctionOff);
            this.player1.play(this.marketFluctuation);
            // Player1 draws first (haunted), which reshuffles discard into deck,
            // making player1 no longer haunted. Then both players discard.
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
