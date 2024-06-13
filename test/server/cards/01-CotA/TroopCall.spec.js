describe('Troop Call', function () {
    describe("Troop Call's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['troop-call'],
                    discard: ['niffle-queen', 'niffle-ape', 'niffle-kong', 'niffle-kong2', 'flaxia']
                },
                player2: {
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                    discard: ['nexus']
                }
            });
        });

        it('should return all Niffle creatures from discard, except top of gigantic creature', function () {
            this.player1.play(this.troopCall);
            expect(this.niffleQueen.location).toBe('hand');
            expect(this.niffleApe.location).toBe('hand');
            expect(this.niffleKong.location).toBe('hand');
            expect(this.niffleKong2.location).toBe('discard');
        });
    });

    describe("Troop Call's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['niffle-queen', 'niffle-ape', 'flaxia'],
                    hand: ['troop-call', 'niffle-kong', 'niffle-kong2']
                },
                player2: {
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                    discard: ['nexus']
                }
            });
        });

        it('should return all Niffle creatures from play area', function () {
            this.player1.play(this.niffleKong);
            this.player1.clickPrompt('Done');
            this.player1.play(this.troopCall);
            expect(this.niffleQueen.location).toBe('hand');
            expect(this.niffleApe.location).toBe('hand');
            expect(this.niffleKong.location).toBe('hand');
            expect(this.niffleKong2.location).toBe('hand');
        });
    });
});
