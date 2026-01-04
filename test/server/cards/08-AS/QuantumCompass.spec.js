describe('Quantum Compass', function () {
    describe("Quantum Compass's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['quantum-compass', 'gub'],
                    discard: ['helper-bot']
                },
                player2: {
                    amber: 1
                }
            });

            this.player1.moveCard(this.helperBot, 'deck');
        });

        it('should have an omni ability to archive the top of your deck', function () {
            this.player1.useAction(this.quantumCompass, true);
            expect(this.helperBot.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
