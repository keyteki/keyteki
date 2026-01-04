describe('Perilous Wild', function () {
    describe("Perilous Wild's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['perilous-wild'],
                    inPlay: ['dew-faerie', 'hunting-witch']
                },
                player2: {
                    inPlay: ['old-bruno', 'dodger']
                }
            });
        });

        it('should destroy all elusive creatures', function () {
            this.player1.play(this.perilousWild);
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('play area');
            expect(this.oldBruno.location).toBe('discard');
            expect(this.dodger.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
