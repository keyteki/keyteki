describe('Stampede', function () {
    describe("Stampede's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['stampede'],
                    inPlay: ['ancient-bear', 'mushroom-man', 'hunting-witch']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should not steal if fewer than 3 creatures were used', function () {
            this.player1.reap(this.ancientBear);
            this.player1.reap(this.mushroomMan);
            this.player1.play(this.stampede);
            expect(this.player1.amber).toBe(3); // amber pip + 2 reaps
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should steal 2A if 3 or more creatures were used this turn', function () {
            this.player1.reap(this.ancientBear);
            this.player1.reap(this.mushroomMan);
            this.player1.reap(this.huntingWitch);
            this.player1.play(this.stampede);
            expect(this.player1.amber).toBe(6); // amber pip + 3 reaps + 2 steal
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
