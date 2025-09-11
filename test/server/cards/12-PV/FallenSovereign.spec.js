describe('Fallen Sovereign', function () {
    describe("Fallen Sovereign's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['fallen-sovereign', 'ruthless-avenger'],
                    inPlay: ['ember-imp', 'yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'searine']
                }
            });
        });

        it('should give neighbors the Mutant trait', function () {
            this.player1.playCreature(this.fallenSovereign, true);
            expect(this.emberImp.hasTrait('mutant')).toBe(true);
            expect(this.yurk.hasTrait('mutant')).toBe(false);
            this.player1.playCreature(this.ruthlessAvenger, true);
            expect(this.ruthlessAvenger.hasTrait('mutant')).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should put itself into play when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.fallenSovereign);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            this.player2.clickPrompt('Right');
            expect(this.fallenSovereign.location).toBe('play area');
            expect(this.fallenSovereign.controller).toBe(this.player2.player);
            expect(this.fallenSovereign.exhausted).toBe(true);
            expect(this.searine.hasTrait('mutant')).toBe(true);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
