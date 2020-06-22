describe('Titan Guardian', function () {
    describe("Titan Guardian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre'],
                    inPlay: ['eyegor', 'titan-guardian', 'doc-bookton']
                },
                player2: {
                    amber: 1,
                    hand: ['life-for-a-life'],
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should draw two cards if it is destroyed while not on a flank', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.lifeForALife);
            this.player2.clickCard(this.badPenny);
            this.player2.clickCard(this.titanGuardian);
            expect(this.player1.hand.length).toBe(8);
            expect(this.titanGuardian.location).toBe('discard');
        });
    });
    describe("Titan Guardian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['dextre'],
                    inPlay: ['eyegor', 'doc-bookton', 'titan-guardian']
                },
                player2: {
                    amber: 1,
                    hand: ['life-for-a-life'],
                    inPlay: ['bad-penny']
                }
            });
        });

        it('should NOT draw two cards if it is destroyed while on a flank', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.lifeForALife);
            this.player2.clickCard(this.badPenny);
            this.player2.clickCard(this.titanGuardian);
            expect(this.player1.hand.length).toBe(6);
            expect(this.titanGuardian.location).toBe('discard');
        });
    });
});
