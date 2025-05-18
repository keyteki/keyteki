describe('Ifraneye', function () {
    describe("Ifraneye's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['ifraneye', 'ember-imp', 'dust-pixie']
                },
                player2: {
                    hand: ['mighty-tiger', 'hunting-witch', 'troll', 'dust-pixie']
                }
            });
        });

        it('should discard your hand when played', function () {
            this.player1.play(this.ifraneye);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make opponent discard 2 random cards when reaping', function () {
            this.player1.playCreature(this.ifraneye);
            this.ifraneye.exhausted = false;
            this.player1.reap(this.ifraneye);
            expect(this.player2.hand.length).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
