describe('Voltash Coilbreath', function () {
    describe("Voltash Coilbreath's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    amber: 3,

                    inPlay: ['voltash-coilbreath']
                },
                player2: {
                    amber: 3,
                    inPlay: ['cannon', 'screechbomb', 'troll']
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

        it('can target artifacts that destroy themselves', function () {
            const deckSize = this.player2.deck.length;
            this.player1.reap(this.voltashCoilbreath);
            expect(this.player1).toHavePrompt('Choose a artifact');
            this.player1.clickCard(this.screechbomb);
            expect(this.screechbomb.location).toBe('deck');
            expect(this.player2.deck[this.player2.deck.length - 1]).toBe(this.screechbomb);
            expect(this.player2.deck.length).toBe(deckSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
