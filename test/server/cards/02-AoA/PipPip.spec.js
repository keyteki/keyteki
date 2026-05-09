describe('Pip-Pip', function () {
    describe("Pip-Pip's stun-on-enemy-reap reaction", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['pip-pip', 'troll']
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
            expect(this.troll.stunned).toBe(false);
            expect(this.pipPip.stunned).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not stun a friendly creature when it reaps', function () {
            this.player1.reap(this.pipPip);
            expect(this.pipPip.stunned).toBe(false);
            expect(this.troll.stunned).toBe(false);
            expect(this.krump.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
