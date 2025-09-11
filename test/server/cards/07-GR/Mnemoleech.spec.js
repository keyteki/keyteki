describe('Mnemoleech', function () {
    describe("Mnemoleech's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'unfathomable',
                    inPlay: ['mnemoleech', 'bubbles']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('steals 1 on reap when opponent not haunted', function () {
            this.player1.reap(this.mnemoleech);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
        });

        it('steals 2 on reap when opponent is haunted', function () {
            this.player1.fightWith(this.bubbles, this.batdrone);
            this.player1.reap(this.mnemoleech);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(1);
        });
    });
});
