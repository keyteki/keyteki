describe('Key Drain', function () {
    describe("Key Drain's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 14,
                    hand: ['key-drain', 'urchin', 'troll', 'bumpsy']
                }
            });
        });

        it('forges a key at +9 amber when nothing is discarded', function () {
            this.player1.play(this.keyDrain);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
        });

        it('reduces forge cost by 1 per discarded card', function () {
            this.player1.player.amber = 12;
            this.player1.play(this.keyDrain);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(0);
        });
    });

    describe("Key Drain's forge cost floor", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 0,
                    hand: [
                        'key-drain',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin',
                        'urchin'
                    ]
                }
            });
        });

        it('does not let you forge for negative amber when more cards are discarded than the +9 modifier', function () {
            this.player1.play(this.keyDrain);
            // Discard all 16 remaining cards in hand: modifier = 9 - 16 = -7.
            // Raw cost would be 6 + (-7) = -1, but is clamped to 0.
            const handCards = this.player1.player.hand.slice();
            for (const card of handCards) {
                this.player1.clickCard(card);
            }
            // Hand is now empty; forge prompt should fire automatically.
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            // Cost is clamped at 0; player started at 0, gained 1 from Key
            // Drain's bonus aember, paid 0, ends at 1 (never negative).
            expect(this.player1.amber).toBe(1);
        });
    });

    describe('Key Drain with a Scrap effect that draws a card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    amber: 12,
                    hand: ['key-drain', 'brillix-ponder', 'urchin']
                }
            });
            // Put urchin on top of the deck so Brillix Ponder's scrap draws it.
            this.player1.moveCard(this.urchin, 'deck');
        });

        it('lets you discard a card drawn by a Scrap effect during the same Key Drain resolution', function () {
            this.player1.play(this.keyDrain);
            // Discard Brillix Ponder; its scrap draws Urchin into hand.
            this.player1.clickCard(this.brillixPonder);
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.urchin.location).toBe('hand');
            // The drawn Urchin can be discarded for Key Drain in the same resolution.
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            // No more cards in hand; proceed to forge prompt.
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            // 12 amber + 1 from Brillix Ponder bonus aember - (9 - 2 discards) = 6
            // Cost = 6 + (9 - 2) = 13; amber 13 - 13 = 0
            expect(this.player1.amber).toBe(0);
        });
    });
});
