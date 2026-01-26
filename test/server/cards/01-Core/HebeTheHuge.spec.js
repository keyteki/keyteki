describe('Hebe the Huge', function () {
    describe("Hebe the Huge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['hebe-the-huge'],
                    inPlay: ['troll', 'bumpsy']
                },
                player2: {
                    inPlay: ['bumpsy', 'ember-imp']
                }
            });
            this.troll.damage = 1;
        });

        it('should deal 2 damage to each other undamaged creature', function () {
            this.player1.play(this.hebeTheHuge);
            expect(this.troll.damage).toBe(1);
            expect(this.bumpsy.damage).toBe(2);
            expect(this.bumpsy.damage).toBe(2);
            expect(this.emberImp.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
