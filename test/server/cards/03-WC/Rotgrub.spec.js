describe('Rotgrub', function () {
    describe("Rotgrub's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['rotgrub'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    amber: 2,
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });

        it('should cause opponent to lose 1A when played.', function () {
            this.player1.play(this.rotgrub);
            expect(this.player2.amber).toBe(1);
        });
    });
    describe("Rotgrub's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['rotgrub'],
                    discard: ['tocsin', 'batdrone']
                },
                player2: {
                    amber: 2,
                    hand: ['mighty-tiger', 'snufflegator', 'inka-the-spider', 'sequis'],
                    discard: ['flaxia', 'nexus']
                }
            });
        });

        it('should archive itself when used to reap.', function () {
            this.player1.reap(this.rotgrub);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(2);
            expect(this.rotgrub.location).toBe('archives');
        });
    });
});
