describe('Strug', function () {
    describe("Strug's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['strug', 'draining-touch'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should make opponent lose 1 amber when played', function () {
            this.player1.playCreature(this.strug);
            expect(this.player2.amber).toBe(3);
        });

        it('should make opponent lose 1 amber when destroyed', function () {
            this.player1.playCreature(this.strug);
            this.player1.play(this.drainingTouch);
            this.player1.clickCard(this.strug);
            expect(this.player2.amber).toBe(2);
        });

        it('should make player lose 2 amber when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.strug);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2.amber).toBe(3);
            expect(this.strug.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
