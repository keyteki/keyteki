describe('Mega Gron Nine-Toes', function () {
    describe("Mega Gron Nine-Toes' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['mega-gron-nine-toes'],
                    hand: ['ballcano']
                },
                player2: {
                    amber: 4
                }
            });
        });

        it('gets +4 power while damaged but not when undamaged', function () {
            const basePower = this.megaGronNineToes.power;
            expect(this.megaGronNineToes.damage).toBe(0);
            expect(this.megaGronNineToes.power).toBe(basePower);
            this.player1.play(this.ballcano);
            expect(this.megaGronNineToes.damage).toBe(4);
            expect(this.megaGronNineToes.power).toBe(basePower + 4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
