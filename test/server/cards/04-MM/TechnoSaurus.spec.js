describe('Techno-Saurus', function () {
    describe("Techno-Saurus's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['techno-saurus']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('does not deal 3D if not exalted', function () {
            this.player1.play(this.technoSaurus);
            this.player1.clickPrompt('Done');
            expect(this.technoSaurus.amber).toBe(0);
            expect(this.troll.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('deals 3D if exalted', function () {
            this.player1.play(this.technoSaurus);
            this.player1.clickCard(this.technoSaurus);
            this.player1.clickCard(this.troll);
            expect(this.technoSaurus.amber).toBe(1);
            expect(this.troll.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Techno-Saurus's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['techno-saurus'],
                    hand: ['troll']
                },
                player2: {}
            });
        });

        it('discards a card and draws a card on reap', function () {
            const handBefore = this.player1.hand.length;
            const deckBefore = this.player1.deck.length;
            this.player1.reap(this.technoSaurus);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.player1.hand.length).toBe(handBefore);
            expect(this.player1.deck.length).toBe(deckBefore - 1);
        });
    });
});
