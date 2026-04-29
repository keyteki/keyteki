describe('Prowler', function () {
    describe("Prowler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'prowler',
                    inPlay: ['prowler:toad', 'seeker-needle']
                },
                player2: {
                    amber: 3
                }
            });

            this.prowler1 = this.player1.player.creaturesInPlay[0];
        });

        it('should steal on reap if opponent has more amber', function () {
            this.player1.reap(this.prowler1);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not steal on reap if opponent does not have more amber', function () {
            this.player2.amber = 2;
            this.player1.reap(this.prowler1);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
