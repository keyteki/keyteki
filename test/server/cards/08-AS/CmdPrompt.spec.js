describe('Cmd. Prompt', function () {
    describe("Cmd. Prompt's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['umbra', 'lamindra'],
                    inPlay: ['cmd-prompt']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should allow one non-Logos card on reap', function () {
            this.player1.reap(this.cmdPrompt);
            this.player1.playCreature(this.umbra);
            this.player1.clickCard(this.lamindra);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
