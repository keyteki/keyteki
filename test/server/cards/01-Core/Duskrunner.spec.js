describe('Duskrunner', function () {
    describe("Duskrunner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['dodger'],
                    hand: ['duskrunner']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should attach to a creature and allow it to steal 1 amber when reaped', function () {
            this.player1.playUpgrade(this.duskrunner, this.dodger);
            this.player1.reap(this.dodger);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
