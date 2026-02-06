describe('Put Into Play Messages', function () {
    describe('put into play from hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['swap-widget', 'mindwarper', 'zorg'],
                    hand: ['yxili-marauder']
                },
                player2: {}
            });
        });

        it('should log correct message when putting a creature into play', function () {
            this.player1.useAction(this.swapWidget);
            this.player1.clickCard(this.mindwarper);
            this.player1.clickCard(this.yxiliMarauder);
            this.player1.clickPrompt('Right');
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Swap Widget to return Mindwarper to their hand',
                'player1 puts Yxili Marauder into play using Swap Widget, and readies it',
                'player1 plays Yxili Marauder'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('put into play from discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['governor-gridelk']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
        });

        it('should log correct message when putting creature from discard into play', function () {
            this.player1.fightWith(this.governorGridelk, this.flaxia);
            this.player1.clickPrompt('Left');
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Governor Gridelk to make Governor Gridelk fight Flaxia',
                'player1 uses Governor Gridelk to put Flaxia into play',
                'player1 plays Flaxia'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
