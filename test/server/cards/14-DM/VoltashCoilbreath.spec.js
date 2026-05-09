describe('Voltash Coilbreath', function () {
    describe("Voltash Coilbreath's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['voltash-coilbreath']
                },
                player2: {
                    inPlay: ['cannon', 'troll']
                }
            });
        });

        it('uses an enemy artifact and puts it on bottom of opp deck', function () {
            const deckSize = this.player2.deck.length;
            this.player1.reap(this.voltashCoilbreath);
            expect(this.player1).toHavePrompt('Choose a artifact');
            this.player1.clickCard(this.cannon);
            // Cannon's action: Deal 2 damage. Target a creature.
            this.player1.clickCard(this.troll);
            expect(this.cannon.location).toBe('deck');
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.cannon);
            expect(this.player2.deck.length).toBe(deckSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
