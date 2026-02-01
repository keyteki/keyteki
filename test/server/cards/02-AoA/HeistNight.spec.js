describe('Heist Night', function () {
    describe("Heist Night's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['heist-night'],
                    inPlay: ['urchin', 'dodger', 'batdrone']
                },
                player2: {
                    amber: 5
                }
            });
        });

        it('should steal 1 amber for each friendly Thief creature', function () {
            this.player1.play(this.heistNight);

            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal amber if no Thief creatures', function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['heist-night'],
                    inPlay: ['batdrone']
                },
                player2: {
                    amber: 5
                }
            });

            this.player1.play(this.heistNight);

            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
