describe('Nantucket', function () {
    describe("Nantucket's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'skyborn',
                    hand: ['bosun-creen'],
                    inPlay: ['bux-bastian', 'nantucket', 'umbra']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('gain 1A for one Skyborn neighbor on reap', function () {
            this.player1.reap(this.nantucket);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gain 2A for two Skyborn neighbors on reap', function () {
            this.player1.moveCard(this.umbra, 'discard');
            this.player1.playCreature(this.bosunCreen);
            this.player1.reap(this.nantucket);
            expect(this.player1.amber).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('gain 1A for one Skyborn neighbor on fight', function () {
            this.player1.fightWith(this.nantucket, this.lamindra);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
