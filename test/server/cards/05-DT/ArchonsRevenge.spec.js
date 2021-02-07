describe("Archon's Revenge", function () {
    describe("Archon's Revenge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    inPlay: ['archon-s-revenge', 'umbra', 'bulleteye', 'lamindra', 'flaxia']
                },
                player2: {
                    amber: 4,
                    inPlay: ['redlock']
                }
            });
        });

        it('should exhaust up to 2 creatures and steal', function () {
            this.player1.useAction(this.archonSRevenge);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.bulleteye);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            expect(this.player1).not.toBeAbleToSelect(this.redlock);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).toHavePromptButton('Done');
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.bulleteye);
            this.player1.clickPrompt('Done');
            expect(this.umbra.exhausted).toBe(true);
            expect(this.bulleteye.exhausted).toBe(true);
            expect(this.lamindra.exhausted).toBe(false);
            expect(this.redlock.exhausted).toBe(false);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });
    });
});
