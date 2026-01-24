describe('Smith', function () {
    describe("Smith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['smith', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['lamindra']
                }
            });
        });

        it('should not gain amber when controlling fewer creatures', function () {
            this.player1.play(this.smith);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not gain amber when controlling equal creatures', function () {
            this.player1.playCreature(this.troll);
            this.player1.play(this.smith);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should gain 2A when controlling more creatures than opponent', function () {
            this.player1.playCreature(this.troll);
            this.player1.playCreature(this.krump);
            this.player1.play(this.smith);
            expect(this.player1.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
