describe('Sibyl Waimare', function () {
    describe("Sibyl Waimare's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['sibyl-waimare', 'urchin', 'groke'],
                    hand: ['nerve-blast']
                },
                player2: {
                    inPlay: ['pelf', 'batdrone', 'skullback-crab'],
                    hand: ['press-gang', 'labwork', 'pour-tal']
                }
            });
        });

        it('should discard card at beginning of opponent turn and exhaust', function () {
            this.player2.moveCard(this.pourTal, 'deck');
            this.player1.endTurn();
            expect(this.pourTal.location).toBe('discard');
            expect(this.sibylWaimare.exhausted).toBe(true);
            expect(this.skullbackCrab.exhausted).toBe(true);
            expect(this.pelf.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.groke.exhausted).toBe(false);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not discard card at beginning of controller turn', function () {
            this.player1.moveCard(this.pourTal, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player1.moveCard(this.nerveBlast, 'deck');
            this.player2.endTurn();
            expect(this.nerveBlast.location).toBe('deck');
            expect(this.sibylWaimare.exhausted).toBe(true); // from previous turn
            expect(this.skullbackCrab.exhausted).toBe(false);
            expect(this.pelf.exhausted).toBe(false);
            expect(this.batdrone.exhausted).toBe(false);
            expect(this.urchin.exhausted).toBe(false);
            expect(this.groke.exhausted).toBe(false);
            this.player1.clickPrompt('unfathomable');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
