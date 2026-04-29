describe("Varghast's Vengeance", function () {
    describe("Varghast's Vengeance scrap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['varghast-s-vengeance']
                },
                player2: {
                    discard: ['troll', 'bumpsy', 'krump']
                }
            });
        });

        it('purges a card from opponent discard then shuffles their discard into deck', function () {
            const opponentDeckBefore = this.player2.player.deck.length;
            this.player1.scrap(this.varghastSVengeance);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('purged');
            expect(this.bumpsy.location).toBe('deck');
            expect(this.krump.location).toBe('deck');
            expect(this.player2.player.deck.length).toBe(opponentDeckBefore + 2);
            expect(this.varghastSVengeance.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Varghast's Vengeance scrap with empty discard", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['varghast-s-vengeance']
                },
                player2: {}
            });
        });

        it('does not trigger scrap when opponent discard empty', function () {
            this.player1.scrap(this.varghastSVengeance);
            // Card scrapped (discarded), no purge prompt
            expect(this.varghastSVengeance.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
