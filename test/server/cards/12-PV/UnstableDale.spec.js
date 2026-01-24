describe('Unstable Dale', function () {
    describe("Unstable Dale's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['unstable-dale', 'searine', 'draining-touch', 'helper-bot'],
                    inPlay: ['flaxia', 'ember-imp'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    amber: 3,
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should deal damage to each creature equal to hand size after reaping', function () {
            this.player1.playCreature(this.unstableDale);
            this.unstableDale.ready();
            this.player1.reap(this.unstableDale);
            expect(this.unstableDale.location).toBe('discard');
            expect(this.flaxia.tokens.damage).toBe(3);
            expect(this.emberImp.location).toBe('discard');
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal 3 damage to each friendly creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.unstableDale);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.flaxia.tokens.damage).toBeUndefined();
            expect(this.emberImp.tokens.damage).toBeUndefined();
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.unstableDale.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
