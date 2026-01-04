describe('Flip Stallard', function () {
    describe("Flip Stallard's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    inPlay: ['brabble', 'lilithal']
                },
                player2: {
                    amber: 2,
                    inPlay: ['flip-stallard', 'troll', 'umbra', 'bad-penny']
                }
            });
        });

        it('should blank enemy creature destroyed effects', function () {
            this.player1.fightWith(this.brabble, this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not blank friendly creature destroyed effects', function () {
            this.player1.fightWith(this.lilithal, this.badPenny);
            expect(this.badPenny.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not blank enemy creature fight effects', function () {
            this.player1.fightWith(this.lilithal, this.umbra);
            expect(this.lilithal.amber).toBe(1);
            this.lilithal.exhausted = false;
            this.player1.fightWith(this.lilithal, this.flipStallard);
            expect(this.flipStallard.location).toBe('discard');
            this.player1.fightWith(this.brabble, this.troll);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
