describe('Upgrades (manual mode)', function () {
    describe('returnToHand menu command on upgrades', function () {
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
            expect(this.comOfficerKirby.upgrades).toContain(this.kirbySBlaster);

            this.game.manualMode = true;
        });

        it('shows only Return to hand on the upgrade menu', function () {
            // Upgrades shouldn't expose exhaust/tokens/place-under options.
            const upgradeCommands = this.kirbySBlaster.getMenu().map((item) => item.command);
            expect(upgradeCommands).toEqual(['click', 'returnToHand']);

            // The host creature should NOT show this
            // option - it is strictly for upgrades.
            const hostCommands = this.comOfficerKirby.getMenu().map((item) => item.command);
            expect(hostCommands).not.toContain('returnToHand');
            // ...but the host still has the standard manual-mode menu.
            expect(hostCommands).toContain('exhaust');
        });

        it("returns the upgrade to its owner's hand and detaches it", function () {
            this.player1.menuClick(this.kirbySBlaster, {
                command: 'returnToHand',
                menu: 'main'
            });
            expect(this.player1).isReadyToTakeAction();
            expect(this.kirbySBlaster.location).toBe('hand');
            expect(this.kirbySBlaster.parent).toBeNull();
            expect(this.comOfficerKirby.upgrades).not.toContain(this.kirbySBlaster);
        });

        it('does nothing outside manual mode', function () {
            this.game.manualMode = false;
            this.player1.menuClick(this.kirbySBlaster, {
                command: 'returnToHand',
                menu: 'main'
            });
            expect(this.kirbySBlaster.location).toBe('play area');
            expect(this.kirbySBlaster.parent).toBe(this.comOfficerKirby);
        });
    });
});
