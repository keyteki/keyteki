describe('Irradiated Æmber', function () {
    describe("Irradiated Æmber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['irradiated-æmber'],
                    inPlay: ['zorg']
                },
                player2: {
                    amber: 6,
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('should deal 3 damage to all enemy creatures when opponent has 6+ amber', function () {
            this.player1.play(this.irradiatedÆmber);
            expect(this.troll.damage).toBe(3);
            expect(this.krump.damage).toBe(3);
            expect(this.zorg.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should do nothing when opponent has less than 6 amber', function () {
            this.player2.amber = 5;
            this.player1.play(this.irradiatedÆmber);
            expect(this.troll.damage).toBe(0);
            expect(this.krump.damage).toBe(0);
            expect(this.zorg.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
