describe('Terrance Surefoot', function () {
    describe("Terrance Surefoot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    amber: 7,
                    hand: ['terrance-surefoot'],
                    inPlay: ['alaka']
                },
                player2: {
                    amber: 5,
                    inPlay: ['flaxia', 'dust-pixie']
                }
            });

            this.player1.playCreature(this.terranceSurefoot);
        });

        it('captures 1 amber on play', function () {
            expect(this.terranceSurefoot.tokens.amber).toBe(1);
            expect(this.player2.amber).toBe(4);
        });

        it('captures 1 amber on reap', function () {
            this.terranceSurefoot.ready();
            this.player1.reap(this.terranceSurefoot);
            expect(this.terranceSurefoot.tokens.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
        });

        it('removes 1 amber when enemy creature reaps', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.terranceSurefoot.tokens.amber).toBe(undefined);
            expect(this.player1.amber).toBe(7);
            expect(this.player2.amber).toBe(5);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not remove 1 amber when friendly creature reaps', function () {
            this.player1.reap(this.alaka);
            expect(this.terranceSurefoot.tokens.amber).toBe(1);
            expect(this.player1.amber).toBe(8);
            expect(this.player2.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
