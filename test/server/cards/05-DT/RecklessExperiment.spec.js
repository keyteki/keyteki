describe('Reckless Experiment', function () {
    describe("Reckless Experiment's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['dextre', 'archimedes', 'hapsis'],
                    hand: ['reckless-experiment'],
                    discard: ['troll', 'groggins', 'alaka']
                },
                player2: {
                    amber: 4,
                    inPlay: ['zorg', 'lamindra']
                }
            });

            this.player1.moveCard(this.alaka, 'deck');
            this.player1.moveCard(this.troll, 'deck');
            this.player1.moveCard(this.groggins, 'deck');
            this.player1.playUpgrade(this.recklessExperiment, this.archimedes);
        });

        it('when reap, should play the top card of the deck', function () {
            this.player1.reap(this.archimedes);
            this.player1.clickPrompt('Left');
            expect(this.groggins.location).toBe('play area');
            expect(this.troll.location).toBe('deck');
            expect(this.alaka.location).toBe('deck');
        });
    });
});
