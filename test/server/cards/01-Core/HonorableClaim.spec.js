describe('Honorable Claim', function () {
    describe("Honorable Claim's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['honorable-claim'],
                    inPlay: ['raiding-knight', 'sequis', 'troll']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should make each friendly Knight creature capture 1 amber', function () {
            this.player1.play(this.honorableClaim);
            expect(this.raidingKnight.amber).toBe(1);
            expect(this.sequis.amber).toBe(1);
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Honorable Claim's ability with no Knights", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['honorable-claim'],
                    inPlay: ['troll']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should not capture amber when there are no Knights', function () {
            this.player1.play(this.honorableClaim);
            expect(this.player2.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Honorable Claim's ability with insufficient amber", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['honorable-claim'],
                    inPlay: ['raiding-knight', 'sequis', 'troll']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should prompt when there is less amber than knights', function () {
            this.player1.play(this.honorableClaim);
            expect(this.player1).toHavePrompt('Not enough amber, choose creatures');
            expect(this.player1).toBeAbleToSelect(this.raidingKnight);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.raidingKnight);
            expect(this.raidingKnight.amber).toBe(1);
            expect(this.sequis.amber).toBe(0);
            expect(this.troll.amber).toBe(0);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
