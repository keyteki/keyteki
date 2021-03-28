describe('Eureka!', function () {
    describe("Eureka!'s ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    inPlay: ['brain-eater'],
                    hand: ['eureka', 'dextre', 'archimedes', 'mother', 'foggify', 'mimicry']
                },
                player2: {
                    hand: ['screechbomb', 'grump-buggy', 'nexus']
                }
            });
        });

        it('should gain 2 amber and archive two random cards', function () {
            this.player1.play(this.eureka);
            expect(this.player1.archives.length).toBe(2);
            expect(this.player1.hand.length).toBe(3);
            expect(this.player1.amber).toBe(4);
        });
    });
});
