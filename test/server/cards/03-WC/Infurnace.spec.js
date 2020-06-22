describe('Infurnace', function () {
    describe("Infurnace's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['infurnace'],
                    discard: ['banish', 'cull-the-weak']
                },
                player2: {
                    amber: 5,
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                    discard: ['fertility-chant', 'fogbank']
                }
            });
        });

        it('should allow the choice of which discard pile to purge from', function () {
            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
        });

        it('should allow purging of no cards from a discard pile', function () {
            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
            this.player1.clickPrompt('Mine');
            this.player1.clickPrompt('Done');
            expect(this.player2.amber).toBe(5);
        });

        it('should allow purging of 1 card from your own discard pile', function () {
            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
            this.player1.clickPrompt('Mine');
            expect(this.player1).toBeAbleToSelect(this.banish);
            expect(this.player1).toBeAbleToSelect(this.cullTheWeak);
            this.player1.clickCard(this.banish);
            this.player1.clickPrompt('Done');
            expect(this.banish.location).toBe('purged');
            expect(this.player2.amber).toBe(4);
        });

        it('should allow purging of 2 cards from your own discard pile', function () {
            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
            this.player1.clickPrompt('Mine');
            expect(this.player1).toBeAbleToSelect(this.banish);
            expect(this.player1).toBeAbleToSelect(this.cullTheWeak);
            this.player1.clickCard(this.banish);
            this.player1.clickCard(this.cullTheWeak);
            this.player1.clickPrompt('Done');
            expect(this.banish.location).toBe('purged');
            expect(this.cullTheWeak.location).toBe('purged');
            expect(this.player2.amber).toBe(3);
        });

        it('should allow purging of 1 card from your opponents discard pile', function () {
            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
            this.player1.clickPrompt("Opponent's");
            expect(this.player1).toBeAbleToSelect(this.fogbank);
            expect(this.player1).toBeAbleToSelect(this.fertilityChant);
            this.player1.clickCard(this.fogbank);
            this.player1.clickPrompt('Done');
            expect(this.fogbank.location).toBe('purged');
            expect(this.player2.amber).toBe(4);
        });

        it('should allow purging of 2 cards from your opponents discard pile', function () {
            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
            this.player1.clickPrompt("Opponent's");
            expect(this.player1).toBeAbleToSelect(this.fogbank);
            expect(this.player1).toBeAbleToSelect(this.fertilityChant);
            this.player1.clickCard(this.fogbank);
            this.player1.clickCard(this.fertilityChant);
            this.player1.clickPrompt('Done');
            expect(this.fogbank.location).toBe('purged');
            expect(this.fertilityChant.location).toBe('purged');
            expect(this.player2.amber).toBe(0);
        });

        it('should consider enhanced icons after purging', function () {
            this.banish.cardData.enhancements = ['amber', 'archive', 'amber'];

            this.player1.play(this.infurnace);
            expect(this.player1).toHavePrompt('Infurnace');
            this.player1.clickPrompt('Mine');
            expect(this.player1).toBeAbleToSelect(this.banish);
            expect(this.player1).toBeAbleToSelect(this.cullTheWeak);
            this.player1.clickCard(this.banish);
            this.player1.clickCard(this.cullTheWeak);
            this.player1.clickPrompt('Done');
            expect(this.banish.location).toBe('purged');
            expect(this.cullTheWeak.location).toBe('purged');
            expect(this.player2.amber).toBe(1);
        });
    });

    describe("Infurnace's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['infurnace'],
                    inPlay: ['ether-spider'],
                    discard: ['banish', 'cull-the-weak']
                },
                player2: {
                    amber: 5,
                    inPlay: ['ether-spider'],
                    discard: ['fertility-chant', 'fogbank']
                }
            });
        });

        it('should not be affected by Ether Spider', function () {
            this.player1.play(this.infurnace);
            this.player1.clickPrompt("Opponent's");
            this.player1.clickCard(this.fogbank);
            this.player1.clickCard(this.fertilityChant);
            this.player1.clickPrompt('Done');
            expect(this.fogbank.location).toBe('purged');
            expect(this.fertilityChant.location).toBe('purged');
            expect(this.player2.amber).toBe(0);
        });
    });
});
