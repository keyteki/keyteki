describe('Varad the Indulgent', function () {
    describe("Varad the Indulgent's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'geistoid',
                    inPlay: ['varad-the-indulgent', 'miss-chievous', 'flaxia']
                },
                player2: {
                    amber: 2,
                    inPlay: ['thing-from-the-deep']
                }
            });
        });

        it('gains +1 power for each amber on it', function () {
            this.varadTheIndulgent.amber = 2;
            this.player1.reap(this.varadTheIndulgent);
            expect(this.varadTheIndulgent.power).toBe(6);
        });

        it('captures when a friendly Geistoid creature fights', function () {
            this.player1.fightWith(this.missChievous, this.thingFromTheDeep);
            expect(this.varadTheIndulgent.power).toBe(5);
            expect(this.varadTheIndulgent.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does not capture when a friendly non-Geistoid creature fights', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('unfathomable');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.fightWith(this.flaxia, this.thingFromTheDeep);
            expect(this.varadTheIndulgent.power).toBe(4);
            expect(this.varadTheIndulgent.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
