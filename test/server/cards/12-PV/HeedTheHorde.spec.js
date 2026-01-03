describe('Heed the Horde', function () {
    describe("Heed the Horde's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['heed-the-horde'],
                    inPlay: ['corrosive-monk', 'ember-imp', 'fandangle']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'chonkers']
                }
            });
        });

        it('should make opponent lose 1 amber for each friendly Mutant creature', function () {
            this.player1.play(this.heedTheHorde);
            expect(this.player2.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should make enemy Mutant creatures capture 1 amber when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.heedTheHorde);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.corrosiveMonk.amber).toBe(1);
            expect(this.fandangle.amber).toBe(1);
            expect(this.emberImp.amber).toBe(0);
            expect(this.chonkers.amber).toBe(0);
            expect(this.krump.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
