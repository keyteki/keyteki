describe("Oh You Shouldn't Have", function () {
    describe("Oh You Shouldn't Have's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['oh-you-shouldn-t-have'],
                    inPlay: ['toad', 'charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['mighty-tiger', 'urchin', 'dust-pixie']
                }
            });
        });

        it('should make opponent gain 3 amber when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.ohYouShouldnTHave);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.urchin);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(5);
            expect(this.ohYouShouldnTHave.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
