describe('Technorachnophobia', function () {
    describe("Technorachnophobia's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['technorachnophobia'],
                    discard: [
                        // ekwidon
                        'auction-off',
                        'avid-collecting',
                        'cursed-relic',
                        'flea-market',
                        'freelancer',
                        'hire-on',
                        'market-crash',
                        'mass-buyout',
                        'outnegotiate',
                        'sandhopper',

                        // untamed
                        'dust-pixie',
                        'flaxia',
                        'hunting-witch',
                        'full-moon',
                        'dharna',

                        // dis
                        'master-of-1',
                        'master-of-2',
                        'master-of-3'
                    ]
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('does nothing if fewer than 5 cards of any house', function () {
            // 4 ekwidon, 3 untamed, 3 dis.
            this.player1.moveCard(this.auctionOff, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.masterOf1, 'deck');
            this.player1.moveCard(this.avidCollecting, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.masterOf2, 'deck');
            this.player1.moveCard(this.cursedRelic, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.moveCard(this.masterOf3, 'deck');
            this.player1.moveCard(this.fleaMarket, 'deck');

            this.player1.play(this.technorachnophobia);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);

            expect(this.auctionOff.location, 'discard');
            expect(this.dustPixie.location, 'discard');
            expect(this.masterOf1.location, 'discard');
            expect(this.avidCollecting.location, 'discard');
            expect(this.flaxia.location, 'discard');
            expect(this.masterOf2.location, 'discard');
            expect(this.cursedRelic.location, 'discard');
            expect(this.huntingWitch.location, 'discard');
            expect(this.masterOf3.location, 'discard');
            expect(this.fleaMarket.location, 'discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 2 if exactly 5 cards of one house', function () {
            // 5 ekwidon, 3 untamed, 2 dis.
            this.player1.moveCard(this.auctionOff, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.masterOf1, 'deck');
            this.player1.moveCard(this.avidCollecting, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.masterOf2, 'deck');
            this.player1.moveCard(this.cursedRelic, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.moveCard(this.freelancer, 'deck');
            this.player1.moveCard(this.fleaMarket, 'deck');

            this.player1.play(this.technorachnophobia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);

            expect(this.auctionOff.location, 'discard');
            expect(this.dustPixie.location, 'discard');
            expect(this.masterOf1.location, 'discard');
            expect(this.avidCollecting.location, 'discard');
            expect(this.flaxia.location, 'discard');
            expect(this.masterOf2.location, 'discard');
            expect(this.cursedRelic.location, 'discard');
            expect(this.huntingWitch.location, 'discard');
            expect(this.freelancer.location, 'discard');
            expect(this.fleaMarket.location, 'discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 2 if 2 houses have exactly 5 cards', function () {
            // 5 ekwidon, 5 untamed
            this.player1.moveCard(this.auctionOff, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.fullMoon, 'deck');
            this.player1.moveCard(this.avidCollecting, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.dharna, 'deck');
            this.player1.moveCard(this.cursedRelic, 'deck');
            this.player1.moveCard(this.huntingWitch, 'deck');
            this.player1.moveCard(this.freelancer, 'deck');
            this.player1.moveCard(this.fleaMarket, 'deck');

            this.player1.play(this.technorachnophobia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);

            expect(this.auctionOff.location, 'discard');
            expect(this.dustPixie.location, 'discard');
            expect(this.fullMoon.location, 'discard');
            expect(this.avidCollecting.location, 'discard');
            expect(this.flaxia.location, 'discard');
            expect(this.dharna.location, 'discard');
            expect(this.cursedRelic.location, 'discard');
            expect(this.huntingWitch.location, 'discard');
            expect(this.freelancer.location, 'discard');
            expect(this.fleaMarket.location, 'discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 2 if more than 5 cards of one house', function () {
            // 6 ekwidon, 2 untamed, 2 dis.
            this.player1.moveCard(this.auctionOff, 'deck');
            this.player1.moveCard(this.dustPixie, 'deck');
            this.player1.moveCard(this.masterOf1, 'deck');
            this.player1.moveCard(this.avidCollecting, 'deck');
            this.player1.moveCard(this.flaxia, 'deck');
            this.player1.moveCard(this.masterOf2, 'deck');
            this.player1.moveCard(this.cursedRelic, 'deck');
            this.player1.moveCard(this.hireOn, 'deck');
            this.player1.moveCard(this.freelancer, 'deck');
            this.player1.moveCard(this.fleaMarket, 'deck');

            this.player1.play(this.technorachnophobia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);

            expect(this.auctionOff.location, 'discard');
            expect(this.dustPixie.location, 'discard');
            expect(this.masterOf1.location, 'discard');
            expect(this.avidCollecting.location, 'discard');
            expect(this.flaxia.location, 'discard');
            expect(this.masterOf2.location, 'discard');
            expect(this.cursedRelic.location, 'discard');
            expect(this.hireOn.location, 'discard');
            expect(this.freelancer.location, 'discard');
            expect(this.fleaMarket.location, 'discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('steals 2 if 10 cards of one house', function () {
            // 5 ekwidon, 3 untamed, 2 dis.
            this.player1.moveCard(this.auctionOff, 'deck');
            this.player1.moveCard(this.avidCollecting, 'deck');
            this.player1.moveCard(this.cursedRelic, 'deck');
            this.player1.moveCard(this.fleaMarket, 'deck');
            this.player1.moveCard(this.freelancer, 'deck');
            this.player1.moveCard(this.hireOn, 'deck');
            this.player1.moveCard(this.marketCrash, 'deck');
            this.player1.moveCard(this.massBuyout, 'deck');
            this.player1.moveCard(this.outnegotiate, 'deck');
            this.player1.moveCard(this.sandhopper, 'deck');

            this.player1.play(this.technorachnophobia);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(1);

            expect(this.auctionOff.location, 'discard');
            expect(this.avidCollecting.location, 'discard');
            expect(this.cursedRelic.location, 'discard');
            expect(this.fleaMarket.location, 'discard');
            expect(this.freelancer.location, 'discard');
            expect(this.hireOn.location, 'discard');
            expect(this.marketCrash.location, 'discard');
            expect(this.massBuyout.location, 'discard');
            expect(this.outnegotiate.location, 'discard');
            expect(this.sandhopper.location, 'discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
