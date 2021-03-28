describe('Dexus', function () {
    describe('card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 3,
                    hand: ['dust-imp'],
                    inPlay: ['lifeward', 'krump', 'grabber-jammer', 'lifeward']
                },
                player2: {
                    inPlay: ['dexus', 'brain-eater']
                }
            });
        });

        it('should cause the opponent to lose an amber when when a right flank creature is played', function () {
            this.player1.play(this.dustImp);

            expect(this.player1.amber).toBe(2);
        });

        it('should not cause the opponent to lose an amber when when a left flank creature is played', function () {
            this.player1.play(this.dustImp, true);

            expect(this.player1.amber).toBe(3);
        });
    });
});

describe('card ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'dis',
                amber: 3,
                hand: ['dust-imp'],
                inPlay: ['lifeward', 'lifeward']
            },
            player2: {
                inPlay: ['sinestra', 'brain-eater']
            }
        });
    });

    it('should cause the opponent to lose an amber when when first creature is played', function () {
        this.player1.play(this.dustImp);

        expect(this.player1.amber).toBe(2);
    });
});
