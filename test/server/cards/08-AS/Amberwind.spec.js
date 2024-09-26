describe('Amberwind', function () {
    describe("Amberwind's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['æmberwind']
                },
                player2: {
                    amber: 2,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should exalt 3 times on play', function () {
            this.player1.playCreature(this.æmberwind);
            expect(this.æmberwind.amber).toBe(3);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should move one amber to your pool on fight', function () {
            this.player1.playCreature(this.æmberwind);
            this.æmberwind.exhausted = false;
            this.player1.reap(this.æmberwind);
            expect(this.æmberwind.amber).toBe(2);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });
    });
});
