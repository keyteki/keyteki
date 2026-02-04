describe('Dharna', function () {
    describe("Dharna's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dharna'],
                    inPlay: ['tunk', 'flaxia']
                },
                player2: {
                    inPlay: ['batdrone', 'dodger']
                }
            });
            this.tunk.damage = 3;
            this.flaxia.damage = 3;
            this.batdrone.damage = 1;
            this.dodger.damage = 3;
        });

        it('should gain amber for each damaged friendly creature on play', function () {
            this.player1.play(this.dharna);
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should heal 2 damage from a friendly creature on reap', function () {
            this.player1.play(this.dharna);
            this.dharna.ready();
            this.player1.reap(this.dharna);
            expect(this.player1).toBeAbleToSelect(this.tunk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            this.player1.clickCard(this.tunk);
            expect(this.tunk.damage).toBe(1);
            expect(this.flaxia.damage).toBe(3);
            expect(this.batdrone.damage).toBe(1);
            expect(this.dodger.damage).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
