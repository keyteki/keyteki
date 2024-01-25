describe('Aelbia Stray', function () {
    describe("Aelbia Stray's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['ælbia-stray', 'a-strong-feeling'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('does not enter play ready if not haunted', function () {
            this.player1.playCreature(this.ælbiaStray);
            expect(this.ælbiaStray.exhausted).toBe(true);
        });

        it('does enter play ready if haunted', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.playCreature(this.ælbiaStray);
            expect(this.ælbiaStray.exhausted).toBe(false);
        });

        it('captures 1 on reap', function () {
            this.player1.play(this.aStrongFeeling);
            this.player1.playCreature(this.ælbiaStray);
            this.player1.reap(this.ælbiaStray);
            expect(this.ælbiaStray.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
        });
    });
});
