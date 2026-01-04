describe('End Turn Prophecy Prompt', function () {
    describe('when ending turn with available prophecies', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    prophecies: [
                        'look-how-far-you-ve-come',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid', 'ember-imp']
                },
                player2: {
                    amber: 4,
                    hand: ['troll'],
                    inPlay: []
                }
            });
        });

        it('should prompt when ending turn with available prophecies', function () {
            // Player has prophecies they could activate but haven't
            expect(this.player1).isReadyToTakeAction();
            this.player1.clickPrompt('End Turn');
            expect(this.player1).toHavePrompt('Are you sure you want to end your turn?');
            this.player1.clickPrompt('Yes');
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
        });

        it('should allow canceling the end turn prompt', function () {
            this.player1.clickPrompt('End Turn');
            expect(this.player1).toHavePrompt('Are you sure you want to end your turn?');
            this.player1.clickPrompt('No');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
