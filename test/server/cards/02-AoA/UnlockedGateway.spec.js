describe('Unlocked Gateway', function () {
    describe("Unlocked Gateway's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['unlocked-gateway'],
                    inPlay: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['krump', 'bumpsy']
                }
            });
        });

        it('destroys every creature in play and ends the step due to Omega', function () {
            this.player1.play(this.unlockedGateway);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
