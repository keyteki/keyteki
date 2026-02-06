describe('Move Creatures Messages', function () {
    describe('swap creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['sanctum-guardian', 'dextre']
                },
                player2: {}
            });
        });

        it('should log correct message when swapping creatures', function () {
            this.player1.reap(this.sanctumGuardian);
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Sanctum Guardian to reap with Sanctum Guardian',
                'player1 uses Sanctum Guardian to swap the position of Dextre and Sanctum Guardian'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('move to flank', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['tyxl-beambuckler']
                },
                player2: {
                    inPlay: ['dextre', 'troll', 'ember-imp']
                }
            });
        });

        it('should log correct message when moving creature to flank', function () {
            this.player1.play(this.tyxlBeambuckler);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Left');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Tyxl Beambuckler',
                'player1 uses Tyxl Beambuckler to deal 2 damage to Troll and move it to a flank'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
