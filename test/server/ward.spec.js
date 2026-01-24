describe('Ward', function () {
    describe('Ward', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['flaxia', 'medic-ingram', 'bumblebird', 'ancient-bear'],
                    hand: ['new-frontiers']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('can be removed by a damage bonus icon', function () {
            this.newFrontiers.enhancements = ['damage'];
            this.player1.reap(this.medicIngram);
            this.player1.clickCard(this.medicIngram);
            expect(this.medicIngram.warded).toBe(true);

            this.player1.play(this.newFrontiers);
            this.player1.clickCard(this.medicIngram);
            expect(this.medicIngram.warded).toBe(false);
        });
    });
});
