describe('Bloodshard Imp', function () {
    describe("Bloodshard Imp's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['bloodshard-imp', 'ember-imp']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('should destroy a creature after it reaps', function () {
            this.player1.reap(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not destroy a warded creature after it reaps', function () {
            this.emberImp.ward();
            this.player1.reap(this.emberImp);
            expect(this.emberImp.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy itself after it reaps', function () {
            this.player1.reap(this.bloodshardImp);
            expect(this.bloodshardImp.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy an enemy creature after it reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.flaxia.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
