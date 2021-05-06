describe('Marmo Swarm', function () {
    describe("Marmo Swarm's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 3,
                    inPlay: ['marmo-swarm', 'niffle-ape']
                },
                player2: {
                    amber: 5,
                    hand: ['hypnobeam', 'mimic-gel', 'effervescent-principle']
                }
            });
        });

        it("should get +1 power for each amber on controller's pool", function () {
            expect(this.niffleApe.power).toBe(3);
            expect(this.marmoSwarm.power).toBe(5);
        });

        it('should decrease power when amber is lost', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.effervescentPrinciple);
            expect(this.marmoSwarm.power).toBe(4);
        });

        it("should look at controller's pool when taken control", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.marmoSwarm);
            expect(this.marmoSwarm.power).toBe(7);
        });

        it("should look at controller's pool when cloned by Mimic Gel", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.mimicGel);
            this.player2.clickCard(this.marmoSwarm);
            expect(this.marmoSwarm.power).toBe(5);
            expect(this.mimicGel.power).toBe(7);
        });
    });
});
