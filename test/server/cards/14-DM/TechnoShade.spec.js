describe('Techno-Shade', function () {
    describe("Techno-Shade's after reap/fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['techno-shade']
                },
                player2: {
                    hand: ['troll']
                }
            });
        });

        it('shuffles a card from opponent hand into deck on reap', function () {
            const handBefore = this.player2.player.hand.length;
            const deckBefore = this.player2.player.deck.length;
            this.player1.reap(this.technoShade);
            expect(this.player2.player.hand.length).toBe(handBefore - 1);
            expect(this.player2.player.deck.length).toBe(deckBefore + 1);
            expect(this.troll.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does nothing when opponent hand is empty', function () {
            for (const card of [...this.player2.player.hand]) {
                this.player2.moveCard(card, 'discard');
            }
            const deckBefore = this.player2.player.deck.length;
            this.player1.reap(this.technoShade);
            expect(this.player2.player.deck.length).toBe(deckBefore);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Techno-Shade also triggers on fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['techno-shade']
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['troll']
                }
            });
        });

        it('shuffles a random card from opponent hand into deck after fight', function () {
            const deckBefore = this.player2.player.deck.length;
            this.player1.fightWith(this.technoShade, this.lamindra);
            expect(this.player2.player.hand.length).toBe(0);
            expect(this.player2.player.deck.length).toBe(deckBefore + 1);
            expect(this.troll.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
