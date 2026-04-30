describe('Golden K1-TT13', function () {
    describe("Golden K1-TT13's persistent effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['urchin', 'iyxrenu-the-clever', 'golden-k1-tt13', 'bumpsy', 'tangrant']
                },
                player2: {
                    inPlay: ['flaxia']
                }
            });
            this.goldenK1Tt13.exhaust();
        });

        it('grants reap-gain-1 to a Mars neighbor while exhausted', function () {
            this.player1.clickPrompt('mars');
            this.player1.reap(this.iyxrenuTheClever);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('grants reap-gain-1 to a non-Mars neighbor while exhausted', function () {
            this.player1.clickPrompt('brobnar');
            this.player1.reap(this.bumpsy);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant reap-gain-1 to a Mars non-neighbor while exhausted', function () {
            this.player1.clickPrompt('mars');
            this.player1.reap(this.tangrant);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant reap-gain-1 to a non-Mars non-neighbor while exhausted', function () {
            this.player1.clickPrompt('shadows');
            this.player1.reap(this.urchin);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not grant reap-gain-1 to an enemy creature while exhausted', function () {
            this.player1.clickPrompt('mars');
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not grant ability while ready', function () {
            this.player1.clickPrompt('mars');
            this.goldenK1Tt13.ready();
            this.player1.reap(this.iyxrenuTheClever);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
