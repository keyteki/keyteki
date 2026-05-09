describe('Leftenant Chars', function () {
    describe('Leftenant Chars when not overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['leftenant-chars', 'bosun-creen']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny']
                }
            });
        });

        it('captures 1 after fighting', function () {
            this.player1.fightWith(this.leftenantChars, this.badPenny);
            expect(this.leftenantChars.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Leftenant Chars when overwhelmed', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'skyborn',
                    inPlay: ['leftenant-chars']
                },
                player2: {
                    amber: 3,
                    inPlay: ['bad-penny', 'krump', 'bumpsy']
                }
            });
        });

        it('steals 2 after fighting', function () {
            this.player1.fightWith(this.leftenantChars, this.badPenny);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.leftenantChars.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
