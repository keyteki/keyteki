describe('Commpod', function () {
    describe("Commpod's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['commpod', 'groggins', 'ulyq-megamouth', 'blypyp'],
                    hand: ['tunk', 'zorg', 'deep-probe', 'jammer-pack', 'sniffer', 'brammo']
                },
                player2: {
                    hand: ['foggify']
                }
            });
        });

        it('should allow to select no cards', function () {
            this.player1.useAction(this.commpod);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow selecting many cards', function () {
            this.player1.play(this.tunk);
            this.player1.reap(this.ulyqMegamouth);
            this.player1.clickCard(this.groggins);
            expect(this.player1.amber).toBe(2);
            this.player1.useAction(this.commpod);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.deepProbe);
            this.player1.clickCard(this.jammerPack);
            this.player1.clickCard(this.sniffer);
            expect(this.player1).not.toBeAbleToSelect(this.brammo);
            this.player1.clickPrompt('Done');

            expect(this.ulyqMegamouth.exhausted).toBe(true);
            expect(this.groggins.exhausted).toBe(true);
            expect(this.tunk.exhausted).toBe(true);
            expect(this.blypyp.exhausted).toBe(false);

            expect(this.player1).toHavePrompt('Choose a creature to ready');
            expect(this.player1).toBeAbleToSelect(this.ulyqMegamouth);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.blypyp);
            expect(this.player1).not.toBeAbleToSelect(this.groggins);
            this.player1.clickCard(this.tunk);
            expect(this.tunk.exhausted).toBe(false);
            this.player1.clickCard(this.ulyqMegamouth);
            expect(this.ulyqMegamouth.exhausted).toBe(false);
            this.player1.clickCard(this.blypyp);
            expect(this.blypyp.exhausted).toBe(false);
            this.player1.clickPrompt('Done');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
