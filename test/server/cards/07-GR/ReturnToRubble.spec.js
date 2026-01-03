describe('Return to Rubble', function () {
    describe("Return to Rubble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['return-to-rubble', 'a-strong-feeling', 'replicative-growth'],
                    inPlay: ['flaxia'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['charette', 'cpo-zytar']
                }
            });
        });

        it('just shuffles discard into deck with fewer than 10 cards', function () {
            let p1deck = this.player1.player.deck.length;
            let p1discard = this.player1.player.discard.length;
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.returnToRubble);
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1.player.deck.length).toBe(p1deck + p1discard);
            expect(this.player1.player.discard.length).toBe(1);
            expect(this.flaxia.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.cpoZytar.location).toBe('play area');
            this.expectReadyToTakeAction(this.player1);
        });

        it('destroys each creature if shuffling 10 cards', function () {
            this.player1.play(this.aStrongFeeling);
            let p1deck = this.player1.player.deck.length;
            let p1discard = this.player1.player.discard.length;
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.returnToRubble);
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1.player.deck.length).toBe(p1deck + p1discard);
            expect(this.player1.player.discard.length).toBe(2);
            expect(this.flaxia.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.aStrongFeeling.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });

        it('only shuffles 10 cards', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.play(this.replicativeGrowth);
            let p1deck = this.player1.player.deck.length;
            let p1discard = this.player1.player.discard.length;
            let shuffled = null;
            this.player1.player.game.on('onDeckShuffled', (event) => (shuffled = event.player));
            this.player1.play(this.returnToRubble);
            expect(shuffled).toBe(this.player1.player);
            expect(this.player1.player.deck.length).toBe(p1deck + p1discard - 1);
            expect(this.player1.player.discard.length).toBe(3);
            expect(this.flaxia.location).toBe('discard');
            expect(this.charette.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.aStrongFeeling.location).toBe('deck');
            expect(this.replicativeGrowth.location).toBe('deck');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
