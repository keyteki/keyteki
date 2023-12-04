describe('Pawn Sacrifice', function () {
    describe("Pawn Sacrifice's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['urchin'],
                    hand: ['nerve-blast', 'pawn-sacrifice', 'silvertooth']
                },
                player2: {
                    amber: 1,
                    inPlay: ['inka-the-spider', 'batdrone']
                }
            });
        });

        it('prompt for a sacrifice and then resolve it, then prompt for creatures to damage', function () {
            this.player1.play(this.pawnSacrifice);
            expect(this.player1).toHavePrompt('Choose a creature to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.inkaTheSpider);
            this.player1.clickPrompt('Done');
            expect(this.batdrone.location).toBe('discard');
            expect(this.inkaTheSpider.location).toBe('discard');
        });

        it('should work correctly when there is only 1 creature to damage', function () {
            this.player1.play(this.silvertooth);
            expect(this.silvertooth.exhausted).toBe(false);
            this.player1.fightWith(this.silvertooth, this.inkaTheSpider);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.inkaTheSpider.location).toBe('discard');
            this.player1.play(this.pawnSacrifice);
            expect(this.player1).toHavePrompt('Choose a creature to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.player1).toHavePrompt('Choose 2 creatures');
            this.player1.clickPrompt('Done');
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should work correctly when there are no creatures to damage', function () {
            this.player1.play(this.nerveBlast);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            this.player1.play(this.silvertooth);
            expect(this.silvertooth.exhausted).toBe(false);
            this.player1.fightWith(this.silvertooth, this.inkaTheSpider);
            expect(this.silvertooth.location).toBe('discard');
            expect(this.inkaTheSpider.location).toBe('discard');
            this.player1.play(this.pawnSacrifice);
            expect(this.player1).toHavePrompt('Choose a creature to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.inkaTheSpider);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.urchin);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
