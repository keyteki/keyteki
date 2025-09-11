describe('Atomic Destabilizer', function () {
    describe("Atomic Destabilizer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'geistoid',
                    hand: ['atomic-destabilizer'],
                    inPlay: ['gub']
                },
                player2: {
                    amber: 5,
                    inPlay: ['dust-pixie']
                }
            });

            this.dustPixie.amber = 3;
        });

        it('should cause creature owner to capture and lose amber at end of their turn', function () {
            this.player1.playUpgrade(this.atomicDestabilizer, this.dustPixie);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.dustPixie.amber).toBe(3);
            this.player2.endTurn();
            expect(this.dustPixie.amber).toBe(4);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(1);
        });
    });
});
