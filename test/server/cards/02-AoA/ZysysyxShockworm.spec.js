describe('Zysysyx Shockworm', function () {
    describe("Zysysyx Shockworm's stun-on-enemy-reap reaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['zysysyx-shockworm', 'blypyp']
                },
                player2: {
                    inPlay: ['krump']
                }
            });
        });

        it('stuns an enemy creature after it reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.krump.stunned).toBe(true);
            expect(this.blypyp.stunned).toBe(false);
            expect(this.zysysyxShockworm.stunned).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not stun a friendly creature when it reaps', function () {
            this.player1.reap(this.blypyp);
            expect(this.blypyp.stunned).toBe(false);
            expect(this.zysysyxShockworm.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
