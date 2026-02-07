describe('Dark Discovery', function () {
    describe("Dark Discovery's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['dark-discovery'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    hand: ['gub', 'krump', 'dust-pixie']
                }
            });
        });

        it('should not discard any cards if opponent deck is empty', function () {
            this.player2.player.deck = [];

            this.player1.play(this.darkDiscovery);

            this.player1.selectCardName('Dust Pixie');
            this.player1.selectCardName('Krump');

            expect(this.darkDiscovery.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard the bottom two cards of the opponents deck and not forge if wrong', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.krump, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');

            this.player1.play(this.darkDiscovery);

            this.player1.selectCardName('Dust Pixie');
            this.player1.selectCardName('Krump');

            expect(this.krump.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.darkDiscovery.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard the one card if there is only 1', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');

            this.player1.play(this.darkDiscovery);

            this.player1.selectCardName('Dust Pixie');
            this.player1.selectCardName('Krump');

            expect(this.gub.location).toBe('discard');
            expect(this.darkDiscovery.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should forge a key if the discarded cards are correct', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');
            this.player2.moveCard(this.krump, 'deck');
            this.player2.moveCard(this.dustPixie, 'deck');

            this.player1.play(this.darkDiscovery);

            this.player1.selectCardName('Gub');
            this.player1.selectCardName('Krump');
            this.player1.clickCard('flaxia');

            expect(this.krump.location).toBe('discard');
            expect(this.gub.location).toBe('discard');

            this.player1.forgeKey('Red');
            expect(this.darkDiscovery.location).toBe('purged');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
