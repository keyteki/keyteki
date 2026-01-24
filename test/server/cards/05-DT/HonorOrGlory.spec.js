describe('HonorOrGlory', function () {
    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'foozle'],
                    hand: ['honor-or-glory']
                },
                player2: {
                    inPlay: ['bumpsy', 'mother', 'helper-bot', 'alaka'],
                    amber: 2
                }
            });
            this.player1.play(this.honorOrGlory);
        });

        describe('selects flank', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Flank');
            });

            it('damage flank creatures', function () {
                expect(this.bumpsy.damage).toBe(3);
                expect(this.mother.damage).toBe(0);
                expect(this.bumpsy.damage).toBe(3);
                expect(this.badPenny.location).toBe('hand');
                expect(this.helperBot.damage).toBe(0);
                expect(this.alaka.damage).toBe(3);
            });
        });

        describe('selects nonflank', function () {
            beforeEach(function () {
                this.player1.clickPrompt('NonFlank');
            });

            it('damage nonflank creatures', function () {
                expect(this.bumpsy.damage).toBe(0);
                expect(this.mother.damage).toBe(3);
                expect(this.bumpsy.damage).toBe(0);
                expect(this.badPenny.damage).toBe(0);
                expect(this.helperBot.location).toBe('discard');
                expect(this.alaka.damage).toBe(0);
            });
        });
    });
});
