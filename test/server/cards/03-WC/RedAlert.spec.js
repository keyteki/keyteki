describe('Red Alert', function () {
    describe("Red Alert's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['red-alert']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });
        it('deal damage equal to the difference in creature count [2]', function () {
            this.player1.play(this.redAlert);
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.mightyTiger.tokens.damage).toBe(2);
        });
    });
    describe("Red Alert's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar'],
                    hand: ['red-alert']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });
        it('deal damage equal to the difference in creature count[1]', function () {
            this.player1.play(this.redAlert);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.mightyTiger.tokens.damage).toBe(1);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(undefined);
        });
    });
    describe("Red Alert's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar', 'first-officer-frane'],
                    hand: ['red-alert']
                },
                player2: {
                    inPlay: ['mighty-tiger', 'hunting-witch'],
                    hand: ['foggify']
                }
            });
        });
        it('deal damage equal to the difference in creature count[0]', function () {
            this.player1.play(this.redAlert);
            expect(this.huntingWitch.tokens.damage).toBe(undefined);
            expect(this.mightyTiger.tokens.damage).toBe(undefined);
            expect(this.lieutenantKhrkhar.tokens.damage).toBe(undefined);
        });
    });
});
