describe('GrandMelee', function () {
    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bad-penny', 'foozle'],
                    hand: ['grand-melee']
                },
                player2: {
                    inPlay: ['bumpsy', 'mother', 'helper-bot', 'alaka'],
                    amber: 2
                }
            });
        });

        describe('plays card', function () {
            beforeEach(function () {
                this.player1.play(this.grandMelee);
            });

            it('destroys card that dont share a house with neighbor', function () {
                expect(this.bumpsy.location).toBe('discard');
                expect(this.mother.location).toBe('play area');
                expect(this.bumpsy.location).toBe('discard');
                expect(this.badPenny.location).toBe('hand');
                expect(this.helperBot.location).toBe('play area');
                expect(this.alaka.location).toBe('discard');
            });
        });
    });
});
