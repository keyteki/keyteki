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
            this.expectReadyToTakeAction(this.player1);
        });

        it('causes each non-haunted player to discard 3 at random', function () {
            this.player1.play(this.marketFluctuation);
            expect(this.player1.player.hand.length).toBe(1);
            expect(this.player2.player.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('causes one haunted player to draw 3, and one non-haunted player to discard 3 at random', function () {
            this.player1.play(this.auctionOff);
            this.player1.play(this.marketFluctuation);
            expect(this.player1.player.hand.length).toBe(6);
            expect(this.player2.player.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can cause a haunted player to become unhaunted', function () {
            this.player1.player.deck = [];
            this.player1.play(this.auctionOff);
            this.player1.play(this.marketFluctuation);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1.player.discard.length).toBe(4);
            expect(this.player2.player.hand.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
