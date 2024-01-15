describe('Sabira the Medium', function () {
    describe("Sabira the Medium's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['help-from-future-self'],
                    inPlay: ['sabira-the-medium'],
                    discard: ['timetraveller', 'poke']
                },
                player2: {
                    amber: 1,
                    hand: ['collar-of-subordination'],
                    inPlay: ['screaming-cave'],
                    discard: ['flaxia']
                }
            });
        });

        it('triggers after a relevant action', function () {
            this.player1.play(this.helpFromFutureSelf);
            this.player1.clickCard(this.timetraveller);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            expect(this.poke.location).toBe('deck');
            expect(this.player1.amber).toBe(5);
        });

        it('triggers when shuffling while drawing', function () {
            for (let c of this.player1.player.deck) {
                this.player1.moveCard(c, 'discard');
            }
            this.player1.endTurn();
            expect(this.player1.amber).toBe(4);
        });

        it('does not trigger when opponent shuffles discard', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.useAction(this.screamingCave);
            this.player2.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });

        it('does trigger when opponent controls it', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.playUpgrade(this.collarOfSubordination, this.sabiraTheMedium);
            this.player2.useAction(this.screamingCave);
            this.player2.endTurn();
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });
    });
});
