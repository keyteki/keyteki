describe('The Susurrus', function () {
    describe("The Susurrus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['the-susurrus', 'scyphos', 'keyfrog']
                },
                player2: {
                    inPlay: ['narp', 'groke', 'alaka'],
                    discard: []
                }
            });
        });

        it('should be able to exhaust up to 3 creatures', function () {
            this.player1.useAction(this.theSusurrus);

            expect(this.player1).toBeAbleToSelect(this.scyphos);
            expect(this.player1).not.toBeAbleToSelect(this.keyfrog);
            expect(this.player1).not.toBeAbleToSelect(this.narp);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            expect(this.player1).not.toBeAbleToSelect(this.alaka);

            this.player1.clickCard(this.scyphos);
            expect(this.scyphos.exhausted).toBe(true);

            expect(this.player1).toBeAbleToSelect(this.scyphos);
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.narp);
            expect(this.player1).toBeAbleToSelect(this.groke);
            expect(this.player1).toBeAbleToSelect(this.alaka);

            this.player1.clickCard(this.narp);
            this.player1.clickCard(this.groke);
            this.player1.clickCard(this.alaka);
            this.player1.clickPrompt('Done');

            expect(this.narp.exhausted).toBe(true);
            expect(this.groke.exhausted).toBe(true);
            expect(this.alaka.exhausted).toBe(true);
        });

        it('should have no effect when choosing an exhausted friendly creature', function () {
            this.player1.reap(this.scyphos);
            this.player1.useAction(this.theSusurrus);

            this.player1.clickCard(this.scyphos);
            expect(this.scyphos.exhausted).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('can exhaust just 2 creatures', function () {
            this.player1.useAction(this.theSusurrus);
            this.player1.clickCard(this.scyphos);
            expect(this.scyphos.exhausted).toBe(true);

            this.player1.clickCard(this.narp);
            this.player1.clickCard(this.groke);
            this.player1.clickPrompt('Done');

            expect(this.narp.exhausted).toBe(true);
            expect(this.groke.exhausted).toBe(true);
            expect(this.alaka.exhausted).toBe(false);
        });
    });
});
