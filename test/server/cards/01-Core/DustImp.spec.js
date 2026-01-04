describe('Dust Imp', function () {
    describe("Dust Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dust-imp']
                },
                player2: {
                    inPlay: ['dodger']
                }
            });
        });

        it('should gain 2 amber when destroyed', function () {
            this.player1.fightWith(this.dustImp, this.dodger);
            expect(this.player1.amber).toBe(2);
            expect(this.dustImp.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
