describe('Tranquil Reiner', function () {
    describe("Tranquil Reiner's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['tranquil-reiner', 'caspart']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('does not ready during ready cards step', function () {
            this.tranquilReiner.exhaust();
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            expect(this.tranquilReiner.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('readies an exhausted non-Dragon creature on reap and gains 3', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            this.troll.exhaust();
            const before = this.player1.amber;
            this.player1.reap(this.tranquilReiner);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.troll);
            expect(this.troll.exhausted).toBe(false);
            // reap (+1) + 3
            expect(this.player1.amber).toBe(before + 4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target Dragon creatures', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ouboros');
            this.caspart.exhaust();
            this.player1.reap(this.tranquilReiner);
            // No valid targets (caspart is Dragon; troll is ready)
            expect(this.caspart.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
