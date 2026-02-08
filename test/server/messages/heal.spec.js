describe('Heal Messages', function () {
    describe('heal damage from creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['grey-monk', 'champion-tabris']
                },
                player2: {}
            });
            this.championTabris.tokens.damage = 3;
        });

        it('should log correct message when healing a creature', function () {
            this.player1.reap(this.greyMonk);
            this.player1.clickCard(this.championTabris);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Grey Monk to reap with Grey Monk',
                'player1 uses Grey Monk to heal Champion Tabris for 2 damage'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
