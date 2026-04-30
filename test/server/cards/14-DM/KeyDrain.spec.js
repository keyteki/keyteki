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
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('reduces forge cost by 1 per discarded card', function () {
            this.player1.play(this.keyDrain);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Key Drain's forge cost floor", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
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

        it('clamps the forge cost at 0 when the negative modifier exceeds the base key cost', function () {
            this.player1.play(this.keyDrain);
            const handCards = this.player1.player.hand.slice();
            for (const card of handCards) {
                this.player1.clickCard(card);
            }
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
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
            this.player1.moveCard(this.urchin, 'deck');
        });

        it('lets you discard a card drawn by a Scrap effect during the same Key Drain resolution', function () {
            this.player1.play(this.keyDrain);
            this.player1.clickCard(this.brillixPonder);
            expect(this.brillixPonder.location).toBe('discard');
            expect(this.urchin.location).toBe('hand');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
