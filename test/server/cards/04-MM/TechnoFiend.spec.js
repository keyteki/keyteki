describe('Techno-Fiend', function () {
    describe("Techno-Fiend's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['techno-fiend'],
                    hand: ['troll']
                },
                player2: {}
            });
        });

        it('discards a card and draws a card on reap', function () {
            const handBefore = this.player1.hand.length;
            const deckBefore = this.player1.deck.length;
            this.player1.reap(this.technoFiend);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handBefore);
            expect(this.player1.deck.length).toBe(deckBefore - 1);
        });
    });

    describe("Techno-Fiend's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['techno-fiend']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll']
                }
            });
        });

        it('steals 1A when destroyed', function () {
            this.player1.fightWith(this.technoFiend, this.troll);
            expect(this.technoFiend.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
