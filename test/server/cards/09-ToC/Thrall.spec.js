describe('Thrall', function () {
    describe("Thrall's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    token: 'thrall',
                    inPlay: ['thrall:toad', 'gub']
                },
                player2: {
                    amber: 1,
                    inPlay: ['troll'],
                    hand: ['krump', 'pelf']
                }
            });

            this.thrall = this.player1.player.creaturesInPlay[0];
        });

        it('should cause opponent to discard one card on destroyed', function () {
            this.player1.fightWith(this.thrall, this.troll);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.discard.length).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
