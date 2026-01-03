describe('Flaxia', function () {
    describe("Flaxia's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['ancient-bear', 'dew-faerie', 'flaxia']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should not gain amber when controlling fewer creatures after play', function () {
            this.player1.play(this.flaxia);
            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber when controlling equal number of creatures after play', function () {
            this.player1.play(this.ancientBear);
            this.player1.play(this.flaxia);
            expect(this.player1.amber).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should gain 2 amber when controlling more creatures after play', function () {
            this.player1.play(this.ancientBear);
            this.player1.play(this.dewFaerie);
            this.player1.play(this.flaxia);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
