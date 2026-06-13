describe('Upgrade Messages (manual mode)', function () {
    describe('returnToHand on upgrade messages', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['com-officer-kirby'],
                    hand: ['kirby-s-blaster']
                },
                player2: {}
            });
            this.player1.playUpgrade(this.kirbySBlaster, this.comOfficerKirby);
            this.game.manualMode = true;
        });

        it('logs returnToHand for an upgrade by name', function () {
            this.player1.menuClick(this.kirbySBlaster, {
                command: 'returnToHand',
                menu: 'main'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Kirby’s Blaster attaching it to Com. Officer Kirby',
                "player1 uses Kirby’s Blaster's amber bonus icon to gain 1 amber",
                'player1 uses Kirby’s Blaster to draw 2 cards',
                'player1 draws 2 cards',
                'player1 manually returns Kirby’s Blaster to their hand'
            ]);
        });
    });
});
