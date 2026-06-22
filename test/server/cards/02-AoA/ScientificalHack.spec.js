describe('Scientifical Hack', function () {
    describe("Scientifical Hack's omni ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['scientifical-hack', 'flamethrower']
                },
                player2: {
                    inPlay: ['troll', 'signal-fire']
                }
            });
        });

        it('destroys itself and lets a friendly artifact of another house be used this turn but not enemy artifacts', function () {
            this.player1.useOmni(this.scientificalHack);
            expect(this.scientificalHack.location).toBe('discard');
            // Enemy artifact cannot be used despite the active-house bypass
            this.player1.clickCard(this.signalFire);
            expect(this.player1).not.toHavePromptButton("Use this card's Action ability");
            // Friendly artifact of another house can be used
            this.player1.useAction(this.flamethrower);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Scientifical Hack with no other friendly artifacts', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['scientifical-hack']
                },
                player2: {}
            });
        });

        it('still destroys itself when there are no other friendly artifacts to enable', function () {
            this.player1.useOmni(this.scientificalHack);
            expect(this.scientificalHack.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
