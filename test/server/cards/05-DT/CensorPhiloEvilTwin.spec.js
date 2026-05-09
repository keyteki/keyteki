describe('Censor Philo Evil Twin', function () {
    describe("Censor Philo Evil Twin's effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    amber: 1,
                    inPlay: ['senator-shrix'],
                    hand: ['censor-philo-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['bramble-lynx', 'tantadlin', 'ancient-bear']
                }
            });

            this.senatorShrix.amber = 1;
            this.tantadlin.amber = 1;
            this.ancientBear.amber = 1;
        });

        it('should deal 5D to a creature with amber', function () {
            this.player1.play(this.censorPhiloEvilTwin);
            expect(this.player1).not.toBeAbleToSelect(this.brambleLynx);
            expect(this.player1).not.toBeAbleToSelect(this.censorPhiloEvilTwin);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.tantadlin);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.damage).toBe(5);
        });
    });
});
