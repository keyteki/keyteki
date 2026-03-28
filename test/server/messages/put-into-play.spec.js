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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Swap Widget to return Mindwarper to their hand',
                'player1 puts Yxili Marauder into play using Swap Widget, and readies it'
            ]);
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
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Governor Gridelk to make Governor Gridelk fight Flaxia',
                'Flaxia is destroyed',
                'player1 uses Governor Gridelk to put Flaxia into play'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('put multiple creatures into play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['final-refrain'],
                    discard: ['troll', 'headhunter']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when putting multiple creatures into play from discard', function () {
            this.player1.play(this.finalRefrain);
            // sequentialPutIntoPlay prompts for creature order
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            // Headhunter is put into play automatically (only one left)
            // Choose creature to fight with, then target
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.headhunter);
            this.player1.clickCard(this.emberImp);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Final Refrain',
                'player1 uses Final Refrain to do several things',
                'player1 uses Final Refrain to put Troll and Headhunter into play ready, fight with each one, and destroy each one',
                'player1 uses Troll to make Troll fight Ember Imp',
                'Ember Imp is destroyed',
                'Troll is destroyed',
                'Headhunter is destroyed'
            ]);
        });
    });
});
