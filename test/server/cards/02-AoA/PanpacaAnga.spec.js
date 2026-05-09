describe('Panpaca, Anga', function () {
    describe("Panpaca, Anga's persistent power buff", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'urchin', 'panpaca-anga', 'lamindra', 'bumpsy']
                },
                player2: {
                    inPlay: ['krump', 'bumblebird']
                }
            });
        });

        it('gives +2 power only to friendly creatures to the right of Panpaca, Anga and does not buff opposing creatures', function () {
            expect(this.troll.power).toBe(8);
            expect(this.urchin.power).toBe(1);
            expect(this.panpacaAnga.power).toBe(5);
            expect(this.lamindra.power).toBe(3);
            expect(this.bumpsy.power).toBe(7);
            expect(this.krump.power).toBe(6);
            expect(this.bumblebird.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Panpaca, Anga on the right flank', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['troll', 'urchin', 'panpaca-anga']
                },
                player2: {
                    inPlay: ['krump', 'bumblebird']
                }
            });
        });

        it('does not buff anyone when there are no creatures to its right and does not buff opposing creatures', function () {
            expect(this.troll.power).toBe(8);
            expect(this.urchin.power).toBe(1);
            expect(this.panpacaAnga.power).toBe(5);
            expect(this.krump.power).toBe(6);
            expect(this.bumblebird.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
