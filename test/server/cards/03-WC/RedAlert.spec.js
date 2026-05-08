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
            expect(this.mightyTiger.damage).toBe(2);
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
            expect(this.huntingWitch.damage).toBe(1);
            expect(this.mightyTiger.damage).toBe(1);
            expect(this.lieutenantKhrkhar.damage).toBe(0);
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
            expect(this.huntingWitch.damage).toBe(0);
            expect(this.mightyTiger.damage).toBe(0);
            expect(this.lieutenantKhrkhar.damage).toBe(0);
        });
    });
});
