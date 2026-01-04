describe('Thunk', function () {
    describe("Thunk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'shadows',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['thunk'],
                    inPlay: ['urchin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump', 'ember-imp']
                }
            });
        });

        it('should deal 2 damage to an enemy creature and exhaust it when played', function () {
            this.player1.play(this.thunk);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            this.player1.clickCard(this.krump);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should destroy each exhausted creature when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.thunk);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.urchin.exhausted = true;
            this.player2.reap(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.emberImp.location).toBe('play area');
            expect(this.urchin.location).toBe('discard');
            expect(this.thunk.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
