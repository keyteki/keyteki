describe('Sir Jaune', function () {
    describe("Sir Jaune's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['sir-jaune'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 9,
                    inPlay: ['krump']
                }
            });
        });

        it('should capture one third of opponent amber when played', function () {
            this.player1.play(this.sirJaune);
            expect(this.sirJaune.tokens.amber).toBe(3); // 9/3 = 3
            expect(this.player2.amber).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should lose one third of amber when fate is triggered', function () {
            this.player2.amber = 5;
            this.player1.activateProphecy(this.overreach, this.sirJaune);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.amber = 8;
            this.player2.reap(this.krump);
            expect(this.player2.amber).toBe(6); // 9/3 = 3 lost
            expect(this.sirJaune.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should round down when calculating amber amounts', function () {
            this.player2.amber = 8;
            this.player1.play(this.sirJaune);
            expect(this.sirJaune.tokens.amber).toBe(2); // 8/3 = 2.66, rounded down to 2
            expect(this.player2.amber).toBe(6);
        });
    });
});
