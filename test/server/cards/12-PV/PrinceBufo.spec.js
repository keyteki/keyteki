describe('Prince Bufo', function () {
    describe("Prince Bufo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 7,
                    house: 'untamed',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['prince-bufo']
                },
                player2: {
                    amber: 2,
                    inPlay: ['krump']
                }
            });
        });

        it('should force opponent to forge a key when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.princeBufo);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            this.player2.forgeKey('Red');
            expect(this.player1.amber).toBe(1);
            expect(this.player1.getForgedKeys()).toBe(1);
            expect(this.player2.getForgedKeys()).toBe(0);
            expect(this.princeBufo.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
