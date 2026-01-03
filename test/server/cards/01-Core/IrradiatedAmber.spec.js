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
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.krump.tokens.damage).toBe(3);
            expect(this.zorg.tokens.damage).toBeUndefined();
            this.expectReadyToTakeAction(this.player1);
        });

        it('should do nothing when opponent has less than 6 amber', function () {
            this.player2.amber = 5;
            this.player1.play(this.irradiatedÆmber);
            expect(this.troll.tokens.damage).toBeUndefined();
            expect(this.krump.tokens.damage).toBeUndefined();
            expect(this.zorg.tokens.damage).toBeUndefined();
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
