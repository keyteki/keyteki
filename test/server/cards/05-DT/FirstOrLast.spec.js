describe('FirstOrLast', function () {
    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'foozle'],
                    hand: ['first-or-last']
                },
                player2: {
                    inPlay: ['bumpsy', 'mother', 'helper-bot', 'alaka'],
                    amber: 2
                }
            });
            this.player1.play(this.firstOrLast);
        });

        describe('selects purge highest', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Highest');
            });

            it('the highest power creatures get purged', function () {
                expect(this.bumpsy.location).toBe('purged');
                expect(this.mother.location).toBe('purged');
                expect(this.foozle.location).toBe('purged');
                expect(this.badPenny.location).toBe('play area');
                expect(this.helperBot.location).toBe('play area');
                expect(this.alaka.location).toBe('play area');
            });
        });

        describe('selects purge highest', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Lowest');
            });

            it('the highest power creatures get purged', function () {
                expect(this.bumpsy.location).toBe('play area');
                expect(this.mother.location).toBe('play area');
                expect(this.foozle.location).toBe('play area');
                expect(this.badPenny.location).toBe('purged');
                expect(this.helperBot.location).toBe('purged');
                expect(this.alaka.location).toBe('play area');
            });
        });
    });
});
