describe('Omega TT', function () {
    describe("Omega TT's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['omega-tt'],
                    discard: ['banish', 'cull-the-weak', 'troll']
                },
                player2: {
                    discard: ['fertility-chant', 'fogbank', 'sequis']
                }
            });
        });

        it('should allow the choice of which discard pile to purge from', function () {
            this.player1.play(this.omegaTt);
            expect(this.player1).toHavePrompt('Choose which discard pile to purge from');
        });

        it('should allow purging of 2 cards from your own discard pile', function () {
            this.player1.play(this.omegaTt);
            this.player1.clickPrompt('Mine');
            expect(this.player1).toBeAbleToSelect(this.banish);
            expect(this.player1).toBeAbleToSelect(this.cullTheWeak);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.fogbank);
            expect(this.player1).not.toBeAbleToSelect(this.fertilityChant);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.banish);
            this.player1.clickCard(this.cullTheWeak);
            this.player1.clickPrompt('Done');
            expect(this.banish.location).toBe('purged');
            expect(this.cullTheWeak.location).toBe('purged');
            expect(this.troll.location).toBe('discard');
        });

        it('should allow purging of 2 cards from your opponents discard pile', function () {
            this.player1.play(this.omegaTt);
            this.player1.clickPrompt("Opponent's");
            expect(this.player1).toBeAbleToSelect(this.fogbank);
            expect(this.player1).toBeAbleToSelect(this.fertilityChant);
            expect(this.player1).toBeAbleToSelect(this.sequis);
            expect(this.player1).not.toBeAbleToSelect(this.banish);
            expect(this.player1).not.toBeAbleToSelect(this.cullTheWeak);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.fogbank);
            this.player1.clickCard(this.fertilityChant);
            this.player1.clickPrompt('Done');
            expect(this.fogbank.location).toBe('purged');
            expect(this.fertilityChant.location).toBe('purged');
            expect(this.sequis.location).toBe('discard');
        });

        it('should require exactly 2 cards to be purged', function () {
            this.player1.play(this.omegaTt);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.banish);
            expect(this.player1).toHavePrompt('Choose 2 cards');
            expect(this.banish.location).toBe('discard');
        });

        it('should shuffle into deck when using action', function () {
            this.player1.playCreature(this.omegaTt);
            this.player1.clickPrompt('Mine');
            this.player1.clickCard(this.banish);
            this.player1.clickCard(this.cullTheWeak);
            this.player1.clickPrompt('Done');
            this.omegaTt.exhausted = false;
            this.player1.useAction(this.omegaTt);
            expect(this.omegaTt.location).toBe('deck');
        });

        it('should allow purging of 1 card when only 1 card is available', function () {
            this.player1.play(this.omegaTt);
            this.player1.clickPrompt('Mine');
            this.player1.moveCard(this.banish, 'purged');
            this.player1.moveCard(this.cullTheWeak, 'purged');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.fogbank);
            expect(this.player1).not.toBeAbleToSelect(this.fertilityChant);
            expect(this.player1).not.toBeAbleToSelect(this.sequis);
            this.player1.clickCard(this.troll);
            this.player1.clickPrompt('Done');
            expect(this.troll.location).toBe('purged');
        });
    });
});
