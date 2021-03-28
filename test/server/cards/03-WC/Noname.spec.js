describe('Infurnace', function () {
    describe("Infurnace's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['noname'],
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
            this.player1.play(this.noname);
            expect(this.player1).toHavePrompt('Noname');
        });

        it('should allow purging of 1 card from your own discard pile on play/fight/reap', function () {
            this.player1.play(this.noname);
            expect(this.player1).toHavePrompt('Noname');
            expect(this.player1).toBeAbleToSelect(this.banish);
            expect(this.player1).toBeAbleToSelect(this.cullTheWeak);
            this.player1.clickCard(this.banish);
            expect(this.banish.location).toBe('purged');
            expect(this.noname.power).toBe(2);
        });

        it('should allow purging of 1 card from your opponents discard pile on play/fight/reap', function () {
            this.player1.play(this.noname);
            expect(this.player1).toHavePrompt('Noname');
            expect(this.player1).toBeAbleToSelect(this.fogbank);
            expect(this.player1).toBeAbleToSelect(this.fertilityChant);
            this.player1.clickCard(this.fogbank);
            expect(this.fogbank.location).toBe('purged');
            expect(this.noname.power).toBe(2);
        });

        it('should gain +1 power for each purged card', function () {
            this.player1.play(this.noname);
            expect(this.player1).toBeAbleToSelect(this.fertilityChant);
            this.player1.clickCard(this.fertilityChant);
            expect(this.fertilityChant.location).toBe('purged');
            this.player1.moveCard(this.banish, 'purged');
            expect(this.noname.power).toBe(3);
        });
    });
});
