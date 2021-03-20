describe('Technobabble', function () {
    describe("Technobabble's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'staralliance',
                    inPlay: ['rocketeer-tryska', 'lamindra'],
                    hand: ['technobabble']
                },
                player2: {
                    amber: 2,
                    inPlay: ['bad-penny', 'troll', 'groggins'],
                    hand: ['mole']
                }
            });
        });

        it('should  creature and each of its neighbors that shares a house with it', function () {
            this.player1.play(this.technobabble);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.rocketeerTryska);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.groggins);
            this.player1.clickCard(this.troll);
            expect(this.lamindra.stunned).toBe(false);
            expect(this.rocketeerTryska.stunned).toBe(false);
            expect(this.badPenny.stunned).toBe(false);
            expect(this.troll.stunned).toBe(true);
            expect(this.groggins.stunned).toBe(true);
        });
    });
});
