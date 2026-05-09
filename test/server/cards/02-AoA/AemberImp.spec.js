describe('Æmber Imp', function () {
    describe("Æmber Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['æmber-imp', 'dust-imp']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('should stun a friendly creature after it reaps', function () {
            this.player1.reap(this.dustImp);
            expect(this.dustImp.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should stun an enemy creature after it reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.flaxia.stunned).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should stun itself when it reaps', function () {
            this.player1.reap(this.æmberImp);
            expect(this.æmberImp.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
