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
                expect(this.bumpsy.tokens.damage).toBe(3);
                expect(this.mother.tokens.damage).toBeUndefined();
                expect(this.bumpsy.tokens.damage).toBe(3);
                expect(this.badPenny.location).toBe('hand');
                expect(this.helperBot.tokens.damage).toBeUndefined();
                expect(this.alaka.tokens.damage).toBe(3);
            });
        });

        describe('selects nonflank', function () {
            beforeEach(function () {
                this.player1.clickPrompt('NonFlank');
            });

            it('damage nonflank creatures', function () {
                expect(this.bumpsy.tokens.damage).toBeUndefined();
                expect(this.mother.tokens.damage).toBe(3);
                expect(this.bumpsy.tokens.damage).toBeUndefined();
                expect(this.badPenny.tokens.damage).toBeUndefined();
                expect(this.helperBot.location).toBe('discard');
                expect(this.alaka.tokens.damage).toBeUndefined();
            });
        });
    });
});
