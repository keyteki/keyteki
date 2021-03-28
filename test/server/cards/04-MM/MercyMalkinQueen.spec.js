describe('Mercy, Malkin Queen', function () {
    describe("Mercy, Malkin Queens's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['floomf'],
                    inPlay: ['mercy-malkin-queen', 'knoxx', 'murmook', 'teliga']
                },
                player2: {
                    inPlay: ['troll', 'bigtwig']
                }
            });
        });

        it('should ready a beast after fight', function () {
            this.player1.reap(this.knoxx);
            this.player1.fightWith(this.mercyMalkinQueen, this.troll);

            expect(this.player1).toBeAbleToSelect(this.knoxx);
            expect(this.player1).toBeAbleToSelect(this.murmook);
            expect(this.player1).not.toBeAbleToSelect(this.mercyMalkinQueen);
            expect(this.player1).not.toBeAbleToSelect(this.teliga);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.bigtwig);

            this.player1.clickCard(this.knoxx);
            expect(this.knoxx.exhausted).toBe(false);
        });

        it('should ward a Cat creature after it enters play', function () {
            this.player1.play(this.floomf);
            expect(this.floomf.tokens.ward).toBe(1);
            expect(this.mercyMalkinQueen.tokens.ward).toBeUndefined();
        });
    });
});

describe("Mercy, Malkin Queens's Play ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'untamed',
                hand: ['floomf']
            },
            player2: {
                inPlay: ['mercy-malkin-queen']
            }
        });
    });

    it('should not ward an enemy Cat creature after it enters play', function () {
        this.player1.play(this.floomf);
        expect(this.floomf.tokens.ward).toBeUndefined();
        expect(this.mercyMalkinQueen.tokens.ward).toBeUndefined();
    });
});
