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

        it('should not forge a key when opponent deck has 0 cards', function () {
            this.player2.player.deck = [];
            this.player1.play(this.darkDiscovery);
            this.player1.selectCardName('Gub');
            this.player1.selectCardName('Krump');

            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.darkDiscovery.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should discard the card and not forge a key when opponent deck has 1 card', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.gub, 'deck');
            this.player1.play(this.darkDiscovery);
            this.player1.selectCardName('Gub');
            this.player1.selectCardName('Krump');

            expect(this.gub.location).toBe('discard');
            expect(this.player1.getForgedKeys()).toBe(0);
            expect(this.darkDiscovery.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        describe('when opponent deck has 2 cards', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.gub, 'deck');
                this.player2.moveCard(this.krump, 'deck');
                this.player1.play(this.darkDiscovery);
            });

            it('should discard cards and not forge a key when guess is wrong', function () {
                this.player1.selectCardName('Gub');
                this.player1.selectCardName('Dust Pixie');

                expect(this.gub.location).toBe('discard');
                expect(this.krump.location).toBe('discard');
                expect(this.player1.getForgedKeys()).toBe(0);
                expect(this.darkDiscovery.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });

            it('should discard cards, forge a key, and purge Dark Discovery when guess is correct', function () {
                this.player1.selectCardName('Gub');
                this.player1.selectCardName('Krump');
                this.player1.forgeKey('Red');

                expect(this.gub.location).toBe('discard');
                expect(this.krump.location).toBe('discard');
                expect(this.player1.getForgedKeys()).toBe(1);
                expect(this.darkDiscovery.location).toBe('purged');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when opponent deck has 3 cards', function () {
            beforeEach(function () {
                this.player2.player.deck = [];
                this.player2.moveCard(this.gub, 'deck');
                this.player2.moveCard(this.krump, 'deck');
                this.player2.moveCard(this.dustPixie, 'deck');
                this.player1.play(this.darkDiscovery);
            });

            it('should discard bottom 2 cards and not forge a key when guess is wrong', function () {
                this.player1.selectCardName('Dust Pixie');
                this.player1.selectCardName('Krump');

                expect(this.gub.location).toBe('discard');
                expect(this.krump.location).toBe('discard');
                expect(this.dustPixie.location).toBe('deck');
                expect(this.player1.getForgedKeys()).toBe(0);
                expect(this.darkDiscovery.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });

            it('should discard bottom 2 cards, forge a key, and purge Dark Discovery when guess is correct', function () {
                this.player1.selectCardName('Gub');
                this.player1.selectCardName('Krump');
                this.player1.forgeKey('Red');

                expect(this.gub.location).toBe('discard');
                expect(this.krump.location).toBe('discard');
                expect(this.dustPixie.location).toBe('deck');
                expect(this.player1.getForgedKeys()).toBe(1);
                expect(this.darkDiscovery.location).toBe('purged');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
