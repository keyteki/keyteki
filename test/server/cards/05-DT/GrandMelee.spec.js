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
                expect(this.badPenny.location).toBe('hand');
                expect(this.foozle.location).toBe('discard');
                expect(this.bumpsy.location).toBe('discard');
                expect(this.mother.location).toBe('play area');
                expect(this.helperBot.location).toBe('play area');
                expect(this.alaka.location).toBe('discard');
            });
        });
    });

    describe('Action test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['bulwark'],
                    hand: ['grand-melee']
                },
                player2: {
                    inPlay: ['bumpsy'],
                    amber: 2
                }
            });
        });

        describe('plays card', function () {
            beforeEach(function () {
                this.player1.play(this.grandMelee);
            });

            it('destroys card that dont have neighbors', function () {
                expect(this.bulwark.location).toBe('discard');
                expect(this.bumpsy.location).toBe('discard');
            });
        });
    });

    describe('Action test with Badge of Unity', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['bulwark', 'the-grey-rider'],
                    hand: ['grand-melee', 'badge-of-unity']
                },
                player2: {
                    inPlay: ['bumpsy'],
                    amber: 2
                }
            });
        });

        describe('plays card with Badge of Unity in play', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.badgeOfUnity, this.bulwark);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('sanctum');
                this.player1.play(this.grandMelee);
            });

            it('destroys card that dont have neighbors', function () {
                expect(this.bulwark.location).toBe('play area');
                expect(this.theGreyRider.location).toBe('play area');
                expect(this.bumpsy.location).toBe('discard');
            });
        });
    });
});
