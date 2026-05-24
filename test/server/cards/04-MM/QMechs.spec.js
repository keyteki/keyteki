describe('Q-Mechs', function () {
    describe("Q-Mechs's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['q-mechs', 'troll']
                },
                player2: {}
            });
        });

        it('draws a card on play', function () {
            const handBefore = this.player1.hand.length;
            const deckBefore = this.player1.deck.length;
            this.player1.play(this.qMechs);
            expect(this.player1.hand.length).toBe(handBefore);
            expect(this.player1.deck.length).toBe(deckBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Q-Mechs's Destroyed ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['q-mechs']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('archives Q-Mechs when destroyed', function () {
            this.player1.fightWith(this.qMechs, this.troll);
            expect(this.qMechs.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
